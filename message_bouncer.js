const xml2js = require('xml2js');
const http = require('http');

const supportedContentTypes = {
    'application/json': JSON.parse,
    'text/plain': body => body,
    'application/xml': body => { 
        if (/<\?xml.*\?>/.test(body)) return body;
        throw new Error('Invalid XML');
    }
};

const createServer = () => {
    return http.createServer((req, res) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const contentType = req.headers['content-type'];

            if (!(contentType in supportedContentTypes)) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Unsupported content type. Supported types are: ' + Object.keys(supportedContentTypes).join(', '));
                return;
            }

            try {
                switch(contentType) {
                    case 'application/json':
                        JSON.parse(body); // try to parse if it's JSON
                        break;
                    case 'application/xml':
                        xml2js.parseString(body, (err, result) => {
                            if(err) {
                                throw new Error('Invalid XML format');
                            }
                        });
                        break;
                    // For 'text/plain', we don't need to do any validation.
                }
                
                res.writeHead(200, {'Content-Type': contentType});
                res.end(body);
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end('Invalid body content');
            }
        });
    });
};



const PORT = 3000;
const server = createServer();

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { createServer };
