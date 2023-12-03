const http = require('http');
const { createServer } = require('../../message_bouncer');
const { ping } =  require('../../server');
const { check } =  require('../../client_server');

describe('Server Tests', () => {
    let server;
    let PORT = 3000;

    beforeAll(done => {
        server = createServer();
        server.listen(0, () => {
            PORT = server.address().port;
            done();
        });
    });

    afterAll(done => {
        server.close(done);
    });

    it('should successfully handle XML data', done => {
        const requestData = '<root><child>test</child></root>';
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };
    
        const req = http.request(options, res => {
            expect(res.statusCode).toBe(200);
            let responseData = '';
            res.on('data', chunk => {
                responseData += chunk;
            });
            res.on('end', () => {
                expect(responseData).toBe(requestData);
                done();
            });
        });
    
        req.on('error', done);
        req.write(requestData);
        req.end();
    });
    it('should successfully handle JSON data', done => {
        const requestData = '{"name":"John", "age":30, "car":null}';
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };
    
        const req = http.request(options, res => {
            expect(res.statusCode).toBe(200);
            let responseData = '';
            res.on('data', chunk => {
                responseData += chunk;
            });
            res.on('end', () => {
                expect(responseData).toBe(requestData);
                done();
            });
        });
    
        req.on('error', done);
        req.write(requestData);
        req.end();
    });

    it('should successfully handle plain text data', done => {
        const requestData = 'i love new brunswick';
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };
    
        const req = http.request(options, res => {
            expect(res.statusCode).toBe(200);
            let responseData = '';
            res.on('data', chunk => {
                responseData += chunk;
            });
            res.on('end', () => {
                expect(responseData).toBe(requestData);
                done();
            });
        });
    
        req.on('error', done);
        req.write(requestData);
        req.end();
    });

    it('should give error for missing content type', done => {
        const requestData = '';
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };
    
        const req = http.request(options, res => {
            expect(res.statusCode).toBe(400); // Update to expect a 400 status code
            let responseData = '';
            res.on('data', chunk => {
                responseData += chunk;
            });
            res.on('end', () => {
                expect(responseData).toBe('Invalid body content'); // Update to expect the specific message
                done();
            });
        });
    
        req.on('error', done);
        req.write(requestData);
        req.end();
    });
    

    it('should give an error for malformed XML', done => {
        const requestData = '<root><child>test</child></root';
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };
    
        const req = http.request(options, res => {
            expect(res.statusCode).toBe(400); // Update to expect a 400 status code
            let responseData = '';
            res.on('data', chunk => {
                responseData += chunk;
            });
            res.on('end', () => {
                expect(responseData).toBe('Invalid body content'); // Update to expect the specific message
                done();
            });
        });
    
        req.on('error', done);
        req.write(requestData);
        req.end();
    });

    it('should give an error for malformed JSON', done => {
        const requestData = '{"name":"John", "age":30, "car":';
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };
    
        const req = http.request(options, res => {
            expect(res.statusCode).toBe(400); // Update to expect a 400 status code
            let responseData = '';
            res.on('data', chunk => {
                responseData += chunk;
            });
            res.on('end', () => {
                expect(responseData).toBe('Invalid body content'); // Update to expect the specific message
                done();
            });
        });
    
        req.on('error', done);
        req.write(requestData);
        req.end();
    });

    it('should bounce back valid JSON data', done => {
        // Define the JSON data you want to send to the server
        const jsonData = { key: 'value' };
    
        // Convert the JSON data to a JSON string
        const requestData = JSON.stringify(jsonData);
    
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestData)
            }
        };
    
        const req = http.request(options, res => {
            expect(res.statusCode).toBe(200); // Expect a 200 OK status code
            let responseData = '';
            res.on('data', chunk => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    // Parse the received JSON data
                    const receivedData = JSON.parse(responseData);
    
                    // Expect the received data to be equal to the original JSON data
                    expect(receivedData).toEqual(jsonData);
    
                    done();
                } catch (error) {
                    done.fail(error); // Fail the test if parsing or comparison fails
                }
            });
        });
    
        req.on('error', done);
        req.write(requestData);
        req.end();
    });
});

describe('Part A', () => {
    it('should reject with an error for an incorrect URL', (done) => {
        const invalidURL = "hhhttp:/google.con";

        ping(invalidURL).catch(error => {
            expect(error).toContain("Invalid URL");
            done();
        });
    });
    it('should resolve with a positive round-trip time for the same city URL', (done) => {
        const sameCityURL = "https://www.rutgers.edu";

        ping(sameCityURL).then(rtt => {
            expect(rtt).toBeGreaterThan(0);
            done();
        }).catch(error => {
            done.fail(error);
        });
    });
    it('should resolve with a positive round-trip time for the same continent URL', (done) => {
        const sameContinentURL = "https://www.google.com";

        ping(sameContinentURL).then(rtt => {
            expect(rtt).toBeGreaterThan(0);
            done();
        }).catch(error => {
            done.fail(error);
        });
    });
    it('should resolve with a positive round-trip time for a different continent URL', (done) => {
        const diffContinentURL = "https://indianrailways.gov.in";

        ping(diffContinentURL).then(rtt => {
            expect(rtt).toBeGreaterThan(0);
            done();
        }).catch(error => {
            done.fail(error);
        });
    });
});


describe('Part B', () => {
    it("should return false when delay is 1 ms", function(done) {
        check("http://localhost:3000", 1).then(results => {
            // Expecting the text to not be the same due to the very short delay
            expect(results.every(result => result.isTextSame === false)).toBe(true);
            done();
        }).catch(error => {
            done.fail(error);
        });
    });

    it("should return false or true when delay is 20 ms", function(done) {
        check("http://localhost:3000", 20).then(results => {
            // Expecting the text could be the same or not due to the moderate delay
            expect(results.some(result => result.isTextSame === true) || results.some(result => result.isTextSame === false)).toBe(true);
            done();
        }).catch(error => {
            done.fail(error);
        });
    });

    it("should return true when delay is 100 ms", function(done) {
        check("http://localhost:3000", 100).then(results => {
            // Expecting the text to be the same due to the longer delay
            expect(results.every(result => result.isTextSame === true)).toBe(true);
            done();
        }).catch(error => {
            done.fail(error);
        });
    });
});





