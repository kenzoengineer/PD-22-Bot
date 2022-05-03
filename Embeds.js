const Moment = require('moment');
const {MongoClient} = require('mongodb');
const uri = `mongodb+srv://replit-user-01:${process.env['password']}@mybotcluster.mbqon.mongodb.net/PDBot?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const col = mongoClient.db("PDBot").collection("DueDates");

// bruh dont read this code this shit is fucked
// why does the embed class also pull from the database
// LOOOOOOOOOOOOOOOOOOOOL

module.exports = {
	connect: async () => {
		await mongoClient.connect();
	},
	
	getDelta: async () => {
		let res = (
			await col.find({
				"Date" : {$gte: (Moment().subtract({hours: "4"})).startOf('day').toDate()}
			}).sort({Date:-1}
		).toArray()).slice(-1)[0];
		let a = Moment(res.Date).diff(((Moment().subtract({hours: "4"})).startOf('day'))) / 86400000;
		console.log(a);
		return a;
	},
	
	insert: async (a,b,c,d = "") => {
		await col.insertOne({
			Name: a,
			Date: new Date(b), //2022-09-17
			Weighting: c,
			Special: d
		});
	},
	
	getAll: async () => {
		return await col.find().sort({Date:-1}).toArray();
	},
	
	commandEmbed: async () => {
		let res = (
			await col.find({
				"Date" : {$gte: (Moment().subtract({hours: "4"})).startOf('day').toDate()}
			}).sort({Date:-1}
		).toArray()).slice(-1)[0];
		const e = {
	      "title": `${res.Name}`,
	      "description": `in **${
Moment(res.Date).diff(((Moment().subtract({hours: "4"})).startOf('day'))) / 86400000 
				}** days`,
	      "color": 0x00FFFF,
	      "fields": [
	        {
	          "name": `Due`,
	          "value": `**${Moment(res.Date).format("MMM DD YYYY")} @ 23:55 EST**`,
	          "inline": true
	        },
	        {
	          "name": `Weighting`,
	          "value": `**${res.Weighting}**`,
	          "inline": true
	        }
	      ],
	      "footer": {
	        "text": `PD-22 Reminders · Go to #role-assignment`
	      }
	    }
		return e;
	},
	
	interpEmbed: async (dummy,a,b,c,d = "") => {
		let res = (
			await col.find({
				"Date" : {$gte: (Moment().subtract({hours: "4"})).startOf('day').toDate()}
			}).sort({Date:-1}
		).toArray()).slice(-1)[0];
		const e = {
	      "title": `${a}`,
	      "description": `in **${d}** days`,
	      "color": 0x00FFFF,
	      "fields": [
	        {
	          "name": `Due`,
	          "value": `**${Moment(b).format("MMM DD YYYY")} @ 23:55 EST**`,
	          "inline": true
	        },
	        {
	          "name": `Weighting`,
	          "value": `**${c}**`,
	          "inline": true
	        }
	      ],
	      "footer": {
	        "text": `PD-22 Reminders · Go to #role-assignment`
	      }
	    }
		return e;
	},
	
	alertEmbed: async () => {
		let res = (
			await col.find({
				"Date" : {$gte: (Moment().subtract({hours: "4"})).startOf('day').toDate()}
			}).sort({Date:-1}
		).toArray()).slice(-1)[0];
		const e = {
	      "title": `${res.Name}`,
	      "description": `${res.Special}`,
	      "color": 0xEF444E,
	      "fields": [
	        {
	          "name": `Due`,
	          "value": `**TODAY @ 23:55 EST**`,
	          "inline": true
	        },
	        {
	          "name": `Weighting`,
	          "value": `**10%**`,
	          "inline": true
	        }
	      ],
	      "image": {
	        "url": `https://c.tenor.com/-jncD6Ey3CQAAAAC/studying-anime.gif`
	      },
	      "footer": {
	        "text": `PD-22 Reminders · Go to #role-assignment`
	      }
	    }
		return e;
	},
}