// services/domainService.js

const extractDomain = (url) => {
    try {
      const domain = new URL(url);
      return domain.hostname;
    } catch {
      try {
        const domain = new URL('https://' + url);
        return domain.hostname;
      } catch {
        throw new Error('Invalid URL format');
      }
    }
  };
  
  export const analyzeDomain = async (url) => {
    const domain = extractDomain(url);
    
    try {
      const [whoisData, sslData, dnsData] = await Promise.all([
        fetchWhoisData(domain),
        checkSSL(domain),
        checkDNS(domain)
      ]);
  
      return {
        domain,
        score: calculateScore(sslData, whoisData, dnsData),
        ssl: sslData,
        whois: whoisData,
        dns: dnsData,
        securityChecks: {
          hsts: Boolean(sslData.hsts),
          dmarc: checkDMARC(dnsData.txtRecords),
          spf: checkSPF(dnsData.txtRecords)
        },
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      console.error('Domain analysis failed:', error);
      throw new Error(`Domain analysis failed: ${error.message}`);
    }
  };
  
  const calculateScore = (ssl, whois, dns) => {
    let score = 50; // Base score
    
    // SSL factors
    if (ssl.valid) score += 20;
    if (ssl.grade === 'A' || ssl.grade === 'A+') score += 10;
    
    // DNS factors
    if (dns.nameservers.length > 1) score += 10;
    if (checkDMARC(dns.txtRecords)) score += 5;
    if (checkSPF(dns.txtRecords)) score += 5;
    
    return Math.min(100, score);
  };
  
  const fetchWhoisData = async (domain) => {
   
  
    const response = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_2tNyegu8HMEFCjlmY2252ISJEiec6&domainName=${domain}`);
    
    if (!response.ok) {
      throw new Error('WHOIS lookup failed');
    }
  
    const data = await response.json();
    
    return {
      creationDate: data.WhoisRecord.createdDate,
      registrar: data.WhoisRecord.registrarName,
      status: data.WhoisRecord.status?.[0] || 'Unknown',
      expiryDate: data.WhoisRecord.expiresDate
    };
  };
  
  const checkSSL = async (domain) => {
    // First initiate the scan
    const startResponse = await fetch(`https://api.ssllabs.com/api/v2/analyze?host=${domain}&startNew=on`);
    if (!startResponse.ok) {
      throw new Error('SSL check initiation failed');
    }
  
    // Poll until the scan is complete
    let result;
    for (let i = 0; i < 10; i++) { // Max 10 attempts
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds between checks
      
      const checkResponse = await fetch(`https://api.ssllabs.com/api/v2/analyze?host=${domain}`);
      result = await checkResponse.json();
      
      if (result.status === 'READY' || result.status === 'ERROR') {
        break;
      }
    }
  
    if (!result || result.status !== 'READY') {
      throw new Error('SSL check timed out or failed');
    }
  
    const endpoint = result.endpoints[0];
    return {
      valid: endpoint.grade !== 'T' && endpoint.grade !== 'M',
      issuer: endpoint.details?.cert?.issuerLabel || 'Unknown',
      expiryDate: new Date(endpoint.details?.cert?.notAfter || Date.now()).toISOString(),
      grade: endpoint.grade,
      hsts: endpoint.details?.hstsPolicy?.status === "present"
    };
  };
  
  const checkDNS = async (domain) => {
    // Query A records
    const aResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const aData = await aResponse.json();
  
    // Query NS records
    const nsResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`);
    const nsData = await nsResponse.json();
  
    // Query TXT records
    const txtResponse = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`);
    const txtData = await txtResponse.json();
  
    return {
      aRecords: (aData.Answer || [])
        .filter(record => record.type === 1)
        .map(record => record.data),
      nameservers: (nsData.Answer || [])
        .filter(record => record.type === 2)
        .map(record => record.data),
      txtRecords: (txtData.Answer || [])
        .filter(record => record.type === 16)
        .map(record => record.data)
    };
  };
  
  const checkDMARC = (txtRecords) => {
    return txtRecords.some(record => 
      record.toLowerCase().includes('v=dmarc1')
    );
  };
  
  const checkSPF = (txtRecords) => {
    return txtRecords.some(record => 
      record.toLowerCase().includes('v=spf1')
    );
  };