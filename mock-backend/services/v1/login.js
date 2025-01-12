const __users = require('../../database/users')
const HmacSHA256 = require('crypto-js/hmac-sha256');
const Utf8 = require('crypto-js/enc-utf8');
const Base64 = require('crypto-js/enc-base64');

const jwtSecret = 'some-secret-code-goes-here';

const usersTokens = []

function base64url(source) {
	// Encode in classical base64
	let encodedSource = Base64.stringify(source);

	// Remove padding equal characters
	encodedSource = encodedSource.replace(/=+$/, '');

	// Replace characters according to base64url specifications
	encodedSource = encodedSource.replace(/\+/g, '-');
	encodedSource = encodedSource.replace(/\//g, '_');

	// Return the base64 encoded string
	return encodedSource;
}

function generateJWTToken(tokenPayload) {
	// Define token header
	const header = {
		alg: 'HS256',
		typ: 'JWT'
	};

	// Calculate the issued at and expiration dates
	const date = new Date();
	const iat = Math.floor(date.getTime() / 1000);
	const exp = Math.floor(date.setDate(date.getDate() + 7) / 1000);

	// Define token payload
	const payload = {
		iat,
		iss: 'Fuse',
		exp,
		...tokenPayload
	};

	// Stringify and encode the header
	const stringifiedHeader = Utf8.parse(JSON.stringify(header));
	const encodedHeader = base64url(stringifiedHeader);

	// Stringify and encode the payload
	const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
	const encodedPayload = base64url(stringifiedPayload);

	// Sign the encoded header and mock-api
	let signature = `${encodedHeader}.${encodedPayload}`;
	// @ts-ignore
	signature = HmacSHA256(signature, jwtSecret);
	// @ts-ignore
	signature = base64url(signature);

	// Build and return the token
	return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJWTToken(token) {
	// Split the token into parts
	const parts = token.split('.');
	const header = parts[0];
	const payload = parts[1];
	const signature = parts[2];

	// Re-sign and encode the header and payload using the secret
	const signatureCheck = base64url(HmacSHA256(`${header}.${payload}`, jwtSecret));

	// Verify that the resulting signature is valid
	return signature === signatureCheck;
}

const postAuthLogin = ({username, password}) => {
    const user = __users.find((result) => 
        result.user.username === username && 
        result.user.password === password
    )
    
    if(!user){
        return {
            message: "You have entered an invalid username or password"
        }
    }

    const access_token = generateJWTToken({ id: user.id })

    user.access = {
        access_token: access_token,
        refresh_token: access_token
     }

     usersTokens.push({
        userid: user.id,
        access_token: access_token
     })

    return user
}

const postAuthLoginVerify = ({token}) => {
    const userTokenMatch = usersTokens.find(user => user.access_token === token)
    const user = __users.find((result) => result.id === userTokenMatch.userid)

    user.access = {
        access_token: token,
        refresh_token: token
    }

    return user
}

module.exports = {
    postAuthLogin,
    postAuthLoginVerify
}
  