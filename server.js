const dbOperation = require('./db-files/dbOperation');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const API_PORT = process.env.PORT || 5000;
const app = express();
const jsonParser = bodyParser.json();
app.use(express.json({
    type: ['application/json', 'text/plain']
  }))

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.get('/getUsers', jsonParser, async(req, res) => {
    const result = await dbOperation.getUsers();
    res.send(JSON.stringify(result.recordset));
})

app.get('/getStadiumManagers', jsonParser, async(req, res) => {
    const result = await dbOperation.getStadiumManagers();
    res.send(JSON.stringify(result.recordset));
})

app.get('/getClubRepresentatives', jsonParser, async(req, res) => {
    const result = await dbOperation.getClubRepresentatives();
    res.send(JSON.stringify(result.recordset));
})
 
// Admin //
app.post('/addClub', jsonParser, async (req, res) => {
    return await dbOperation.addClub(req.body.name, req.body.location);
})

app.post('/delClub', jsonParser, async (req, res) => {
    return await dbOperation.delClub(req.body.name);
})

app.post('/addStadium', jsonParser, async (req, res) => {
    return await dbOperation.addStadium(req.body.name, req.body.location, req.body.capacity);
})

app.post('/delStadium', jsonParser, async (req, res) => {
    return await dbOperation.delStadium(req.body.name);
})

app.post('/blockFan', jsonParser, async (req, res) => {
    return await dbOperation.blockFan(req.body.nat_id);
})

app.post('/unblockFan', jsonParser, async (req, res) => {
    return await dbOperation.unblockFan(req.body.nat_id);
})

app.get('/viewStadiums', jsonParser, async (req, res) => {
    const result = await dbOperation.viewStadiums();
    res.send(JSON.stringify(result.recordset));
})

app.get('/viewClubs', jsonParser, async (req, res) => {
    const result = await dbOperation.viewClubs();
    return res.send(result.recordset);
})

app.get('/viewFans', jsonParser, async (req, res) => {
    const result = await dbOperation.viewFans();
    return res.send(result.recordset);
})

app.post('/openStadium', jsonParser, async (req, res) => {
    return await dbOperation.openStadium(req.body.name);
})

app.post('/closeStadium', jsonParser, async (req, res) => {
    return await dbOperation.closeStadium(req.body.name);
})



// Sports Association Manager //
app.post('/newSAM', jsonParser, async (req, res) => {
    const a = await dbOperation.addNewSAM(req.body.name, req.body.username, req.body.password);
})

app.post('/newMatch', jsonParser, async(req, res) => {
    return await dbOperation.addNewMatch(req.body.host, req.body.guest, req.body.startTime, req.body.endTime);
})

app.post('/delMatch', jsonParser, async(req, res) => {
    return await dbOperation.delMatch(req.body.host, req.body.guest, req.body.startTime, req.body.endTime);
})

app.get('/viewAllMatches', jsonParser, async (req, res) => {
    const result = await dbOperation.viewAllMatches();
    return res.send(result.recordset);
})

app.get('/viewUpcomingMatches', jsonParser, async (req, res) => {
    const result = await dbOperation.viewUpcomingMatches();
    return res.send(result.recordset);
})

app.get('/viewPreviousMatches', jsonParser, async (req, res) => {
    const result = await dbOperation.viewPreviousMatches();
    return res.send(result.recordset);
})

app.get('/viewClubsNotScheduledTogether', jsonParser, async (req, res) => {
    const result = await dbOperation.viewClubsNotScheduledTogether();
    return res.send(result.recordset);
})



// Club Representative //
app.post('/newCR', jsonParser, async (req, res) => {
    return await dbOperation.addNewCR(
        req.body.name,
        req.body.username,
        req.body.password,
        req.body.club
    );
})

app.post('/viewMyClub', jsonParser, async (req, res) => {
    const result = await dbOperation.viewMyClub(req.body.username);
    return res.send(result.recordset);
})

app.post('/myUpcomingMatches', jsonParser, async (req, res) => {
    const result = await dbOperation.myUpcomingMatches(req.body.username);
    return res.send(result.recordset);
})

app.post('/availableStadiumsOn', jsonParser, async (req, res) => {
    const result = await dbOperation.availableStadiumsOn(req.body.date);
    return res.send(result.recordset);
})

app.post('/addHostRequest', jsonParser, async (req, res) => {
    console.log(req.body)
    const result = await dbOperation.addHostRequest(req.body.cr_id, req.body.sm_id, req.body.m_id);
    return res.send(result.recordset);
})

app.get('/viewRequests', jsonParser, async(req, res) => {
    const result = await dbOperation.viewRequests();
    res.send(JSON.stringify(result.recordset));
})



// Stadium Manager //
app.post('/newSM', jsonParser, async (req, res) => {
    return await dbOperation.addNewSM(
        req.body.name, 
        req.body.username, 
        req.body.password,
        req.body.stadium
    );
})

app.post('/viewMyStadium', jsonParser, async (req, res) => {
    const result = await dbOperation.viewMyStadium(req.body.username);
    return res.send(result.recordset);
})

app.post('/viewMyRequests', jsonParser, async (req, res) => {
    const result = await dbOperation.viewMyRequests(req.body.username);
    return res.send(result.recordset);
})

app.post('/acceptRequest', jsonParser, async (req, res) => {
    const result = await dbOperation.acceptRequest(req.body.username, req.body.host, req.body.guest, req.body.startTime);
    return res.send(result.recordset);
})

app.post('/rejectRequest', jsonParser, async (req, res) => {
    const result = await dbOperation.rejectRequest(req.body.username, req.body.host, req.body.guest, req.body.startTime);
    return res.send(result.recordset);
})

app.post('/viewMatchesOnStadium', jsonParser, async (req, res) => {
    const result = await dbOperation.viewMatchesOnStadium(req.body.username);
    return res.send(result.recordset);
})




// Fan //
app.post('/newF', jsonParser, async (req, res) => {
    return await dbOperation.addNewF(
        req.body.name, 
        req.body.username, 
        req.body.password,
        req.body.nat_id,
        req.body.birthdate,
        req.body.address,
        req.body.phone
    );
})

app.post('/viewMyTickets', jsonParser, async (req, res) => {
    const result = await dbOperation.viewMyTickets(req.body.username);
    return res.send(result.recordset);
})

app.post('/viewAvailableTickets', jsonParser, async(req, res) => {
    const result = await dbOperation.viewAvailableTickets(req.body.username);
    return res.send(result.recordset);
})

app.post('/purchaseTicket', jsonParser, async(req, res) => {
    return await dbOperation.purchaseTicket(req.body.username, req.body.id);
})

app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`));