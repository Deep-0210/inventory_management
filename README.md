# inventory_management

**Testing methods**

 <code> npx autocannon -m POST -c 100 -d 60 -H "Content-Type: application/json" -b "{\"email\": \"test@example.com\"}" http://localhost:3005
 </code>

 <code> npx autocannon -m POST -c 100 -d 60 -H "Content-Type: application/json" -b '{\"email\":\"test@example.com\"}' http://localhost:3005
 </code>

<br>

 * with above code we can measure load balancing for our backend project