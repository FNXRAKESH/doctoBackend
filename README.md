# Backend

<h3><b><i>This web application supports MERN stack and here entire Backend APIs and their middlewares are written. Backend is developed using Nodejs and MongoDB is used as NOSQL database.</i></b></h3>

<b>-----------------------------------------------------------------------------------</b>

<h2>Documentation of Backend</h2>

<h4> Backend and Database is already hosted so you just need to hit with diiferent routes to insert data into database and complete integration. </h4>

<h4>Different routes :-</h4>
<p>
-> Auth routes <br>
-> User routes <br>
-> Doctor routes <br>
-> Review routes
</p>

<h4><b>Auth routes :-</b></h4>
<p> We have following routes in Authentication API.<br>
    a) signup route ->  <br>
    address: http://157.245.105.212:3000/api/signup <br>
    fields inserted : name*, email*, mobile*, password* (min : 3), role, reviews, favourite, dob.<br>
    b) signin route -> <br>
    address: http://157.245.105.212:3000/api/signin <br>
    fields inserted: mobile*, password* (min: 3) <br>
    c) signout route -> <br>
    address: http://157.245.105.212:3000/api/signout <br>
    <i> clear the jwt token from browser cookies .</i>
    * means required fields.<br>

</p><br/>

<h4><b>User routes :-</b></h4>
<p> We have following routes in User API.<br>
    a) User Profile <b>GET</b> route ->  <br>
    address: http://157.245.105.212:3000/api/user/:userId <br>
    fields inserted : name*, email*, mobile*, password* (min : 3), role, reviews, favourite, dob.<br>
    b) User Profile <b>PUT</b> route -> <br>
    address: http://157.245.105.212:3000/api/user/:userId <br>
    fields inserted: mobile*, password* (min: 3) <br/>

</p>

<h4><b>Doctor routes :-</b></h4>
<p> We have following routes in Doctor CRUD API.<br>
    a) create doctor route ->  <br>
    address: http://157.245.105.212:3000/api/doctor/create/5f0c98f3a03036352ef214cb <br>
    Method: POST <br>
    admin authentication jwt token required in header, you will get token after logging in as admin.
    It's a protected route, only admin can access!!
    <br>
    b) get doctors route -> <br>
    address: http://157.245.105.212:3000/api/doctor/:doctorId <br>
    method: GET <br>
    doctor id you have to pass in route to get particular doctor details, no authentication required!! <br>
    c) get all doctors homepage -> <br>
    address: http://157.245.105.212:3000/api/doctors <br>
    Method: GET <br>
    This route is for homepage of Docto App, it doesn't require any authentication <br>
    <i> Refer to Postman collection that i have already shared for inputs and testing.</i>
    * means required fields.<br>
</p><br/>

<h4><b>Review routes :-</b></h4>
<p> We have following routes in Review CRUD API.<br>
    a) create review route ->  <br>
    address: http://157.245.105.212:3000/api/review/create/:doctorId/:userId <br>
    Method: POST <br>
    You will require jwt authentication token that you will get after user login, then doctorId and userId for creating review.
    <br>
    b) get review route -> <br>
    address: http://157.245.105.212:3000/api/review/:reviewId <br>
    Method: GET <br>
    This will give you a single review. You need to login to read review, it means this route needs jwt auth token to call API <br>
    c) get all reviews -> <br>
    address: http://157.245.105.212:3000/api/reviews <br>
    Method: GET <br>
    This will give you all routes in response, doesn't need any auth token. <br>
    d) update a review -> <br>
    address: http://157.245.105.212:3000/api/review/:reviewId/:userId <br>
    Method: PUT <br>
    You can update a review, this will need auth jwt token and userid as well as review id that you wanna update. <br>
    e) delete a review -> <br>
    address:  http://157.245.105.212:3000/api/review/:reviewId/:userId <br>
    Method: DELETE <br>
    You can delete a review, this will need auth jwt token and userid as well as review id that you wanna update. <br>
    <i> Refer to Postman collection that i have already shared for inputs and testing.</i>
    <br>
</p><br/>

<h4><b> New Routes:-</b></h4>
<p> New routes added
    a) import contacts route -> <br>
    Address: {{baseurl}}/user/import/:userid <br>
    Method: Put <br>
    Authentication is required <br>
    Body -> <br>
    { <br>
        "contacts": [number1, number2, number3......] <br>
    } <br>
    number1 number2 are phone numbers of contacts in integer format.
    b) Search api by recommendations and distance filtering <br>
    Address: {{baseurl}}/doctors/search/:userId <br>
    Method: Get <br>
    Authentication is required <br>
    Body -> <br>
    { <br>
        "query": "search query text required", <br>
        "coordinates": [latitude, longitutde], <br>
        "distance": distance in meters  <br>
    }<br>
    coordinates and distance are optional if both are given then distance filtering will be done else it will be skipped <br>
    Results will be an array of format -> <br>
    [ [recommendation count, doctor complete object], [recommendation count, doctor complete object]] <br>
