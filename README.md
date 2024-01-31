# signup-with-Google


## Getting Started

Follow these steps to set up and run the Signup with Google application.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/SIGNUP-WITH-GOOGLE.git
   
2. Navigate to the Server directory:

  ```bash
    cd SIGNUP-WITH-GOOGLE/Server
```

3.Install dependencies:

  ```bash
    npm install
```


### Google Credentials

To obtain the Google credentials (Client ID, Client Secret, and Callback URL):

1. Visit the Google Developers Console.
2. Create a new project.
3. In the project dashboard, navigate to the "Credentials" page.
4. Create credentials and choose "OAuth client ID."
5. Configure the consent screen and create credentials.
6. Copy the Client ID and Client Secret.
7. Set the Callback URL to http://localhost:3001/auth/google/callback.
8. Add 'Authorised JavaScript Origins': [http://localhost:3001/](http://localhost:3001)
9. Add 'Authorised redirect URIs': http://localhost:3001/auth/google/callback


### MongoDB Connection URL

1. Set up a MongoDB database.
2. Obtain the connection URL.
3. Set username, password and your database name in the URL:
   ```bash
   mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.f0vq5sj.mongodb.net/<DATABASE_NAME>
   ```

### Environment Variables
Create a .env file in the Server directory and add the following variables:

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
MONGODB_URL=your-mongodb-connection-url
SESSION_KEY=your-session-key
```

### Running the Application
1. Start the Server:
```bash
npm start
```
or 
```bash
nodemon index.js
```
2. Run the index.html file with live server and 'Click Signup using Google'
3. Open your browser and visit http://localhost:3001.

## Usage
1. Visit http://localhost:3001/auth/google to initiate Google authentication.
2. Access the profile page at http://localhost:3001/profile after successful authentication.
