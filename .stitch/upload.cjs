const fs = require('fs');
async function upload() {
  const apiKey = "AQ.Ab8RN6LZO-p2r9stxdL0CAQkpJRgxknnjSG1QyeFeZ-MdV5pBQ";
  const projectId = "17481238420122128037";
  
  const files = [
    {path: ".stitch/home.html", title: "/"},
    {path: ".stitch/sobre.html", title: "/sobre"},
    {path: ".stitch/produtos.html", title: "/produtos"},
    {path: ".stitch/autenticacao.html", title: "/autenticacao"},
    {path: ".stitch/contato.html", title: "/contato"},
    {path: ".stitch/admin.html", title: "/admin"},
  ];

  for (const f of files) {
    const data = fs.readFileSync(f.path);
    const b64 = data.toString('base64');
    
    const request = {
      parent: `projects/${projectId}`,
      createScreenInstances: true,
      requests: [{
        screen: {
          title: f.title,
          htmlCode: {
            fileContentBase64: b64,
            mimeType: "text/html"
          },
          screenType: "DOCUMENT",
          isCreatedByClient: true,
          generatedBy: "stitch::extract-static-html"
        }
      }]
    };
    
    console.log(`Uploading ${f.path}...`);
    const resp = await fetch(`https://stitch.googleapis.com/v1/projects/${projectId}/screens:batchCreate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey
      },
      body: JSON.stringify(request)
    });
    
    if (!resp.ok) {
      console.error(await resp.text());
    } else {
      console.log(`Success ${f.path}`);
    }
  }
}
upload();
