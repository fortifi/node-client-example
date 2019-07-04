const request = require('request');
const http = require('http');

const fortifiApiUrl = 'http://localhost:9090/v1';
//const fortifiApiUrl = 'https://api.fortifi.io/v1';
const fortifiOrg = 'ORG:FORT:1906:otysu';
const fortifiApiUser = 'elh6QnRXcEFz-TEST-WFdUd25mMkZp';
const fortifiApiKey = 'SFpNZllTNnhJdlB0OEwxMlBnaVNmYXJDcjU5YUFo';

let fRequest = request.defaults({baseUrl: fortifiApiUrl, headers: {'X-Fortifi-Org': fortifiOrg}});

let tokenData;

const requestHandler = (request, response) =>
{
  if(request.url === '/')
  {
    fRequest.get('/brands', function (err, r, body)
    {
      response.write(body);
      response.end('Hello Node.js Server!');
    });
  }
};

const server = http.createServer(requestHandler);

// post to set token
function updateToken()
{
  fRequest.post(
    {
      uri: '/svcauth/verify',
      json: {
        id: fortifiApiUser,
        key: fortifiApiKey
      }
    }, function (err, r, body)
    {
      if(r.statusCode === 200)
      {
        tokenData = body.data;
        fRequest = fRequest.defaults({headers: {'Authorization': 'Bearer ' + tokenData.token}});

        // todo: when tokenData.expiry is soon to close, re-request

        // todo: START HTTP SERVER?
        server.listen(8050, function (err)
        {
          if(err)
          {
            return console.log('could not start server', err)
          }

          console.log('server listening on 8050')
        });
      }
      else
      {
        console.error(r.statusCode, r.statusMessage);
      }
    });
}

updateToken();