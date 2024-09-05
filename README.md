# AltruistHub Backend

The AltruistHub backend provides the API for the AltruistHub volunteer management system. It handles user authentication, volunteer management, and testimonial management. This application uses Node.js, Express, and MongoDB to create a robust backend service.

## Features

- **JWT Authentication**: Generate and verify JWT tokens for user authentication.
- **Volunteer Management**: Create, read, update, and delete volunteer posts.
- **Volunteer Requests**: Manage volunteer requests, including creation and deletion.
- **Testimonials**: Retrieve testimonials for display on the frontend.

## Dependencies

- `cookie-parser`: ^1.4.6
- `cors`: ^2.8.5
- `dotenv`: ^16.4.5
- `express`: ^4.19.2
- `jsonwebtoken`: ^9.0.2
- `mongodb`: ^6.8.0
- `nodemon`: ^3.1.4

## Installation

1. **Clone the Repository**
   git clone https://github.com/bhabna01/Altruist-Server.git
   cd altruisthub-backend

2. **Install Dependencies**
   npm install

3. **Configuration**
   Create a .env file in the root directory with the following content:
   DB_USER=volunteerDB
   DB_PASS=2qkvz0On1U1JFdiT
   ACCESS_TOKEN_SECRET=2094ea51d2d5e73534cbb88a21b6dcb7c655b3a99df024a05b7d3c8e45cb590b0c51b01686ceebe88b03042da9108f78d8ae119b4635b0b94eda00b82521dfca
4. **Running the Server**
    nodemon index.js
## API Endpoints
# Authentication
POST /jwt

Description: Generates a JWT token for authenticated users.
Request Body: { "email": "user@example.com" }
Response: { "success": true }
POST /logout

Description: Logs out the user by clearing the JWT token.
Request Body: { "email": "user@example.com" }
Response: { "success": true }
Volunteers
GET /volunteers

Description: Retrieves all volunteer posts, with optional search and filter by email.
Query Parameters: search (string), email (string)
Response: List of volunteer posts.
GET /volunteers/

Description: Retrieves a single volunteer post by ID.
Response: Volunteer post object.
POST /volunteers

Description: Creates a new volunteer post (protected route).
Request Body: Volunteer post object.
Response: { "acknowledged": true, "insertedId": "objectId" }
PATCH /volunteers/

Description: Updates a volunteer post.
Request Body: Partial volunteer post object.
Response: Update result object.
DELETE /volunteers/

Description: Deletes a volunteer post.
Response: Deletion result object.
Volunteer Requests
POST /volunteer-request

Description: Creates a new volunteer request.
Request Body: Volunteer request object.
Response: { "acknowledged": true, "insertedId": "objectId" }
GET /volunteer-request

Description: Retrieves volunteer requests, with optional filter by email.
Query Parameter: email (string)
Response: List of volunteer requests.
DELETE /volunteer-request/

Description: Deletes a volunteer request.
Response: Deletion result object.
Testimonials
GET /testimonials
Description: Retrieves all testimonials.
Response: List of testimonial objects.
## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any questions or support, please reach out to abierhoque01@gmail.com
