// Sample application using Facebook GraphQL

const { graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt
  } = require('graphql');
  
const sql = require('mssql') 

// Domain User config
const config = {
    server: 'SCHVW2K12R2-DB',
	domain: 'SEAGULL',
	user: 'wbw07',
	password: '********',
    database: 'DCustomer',
	options: {
	instanceName: 'MSSQL2016',
	trustedConnection: true,
	encrypt: false
    }
};

var employees = [
	{ 
		id: 1,
		name: 'Donald Duck',
		email: 'DonaldD@Disney.Com'
	},
	{
		id: 2,
		name: 'Albert Einstein',
		email: 'Al@GeneralRelativity.Com'
	},
	{
		id: 3,
		name: 'Tim Tebow',
		email: 'TimmyT@Heisman.Com'
	}
];

var EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    fields: () => ({
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
	  email: { type: GraphQLString }
    })
});

var ContactType = new GraphQLObjectType({
    name: 'Contact',
    fields: () => ({
      Id: { type: GraphQLInt },
      FirstName: { type: GraphQLString },
      LastName: { type: GraphQLString },
	  EMail: { type: GraphQLString }
    })
});

var RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      employees: {
        type: new GraphQLList(EmployeeType),
        resolve:() => {
				return employees;
        }
      }
    ,
      employee: {
        type: EmployeeType,
		args: { id: {type: GraphQLInt }},
        resolve: (parentValue, args) => {
            for(let i=0; i < employees.length; i++) {
			    if (employees[i].id == args.id) {
				  return employees[i];
			    }
			}
        }
      }
    ,
      contacts: {
        type: new GraphQLList(ContactType),
		resolve: () => {
			return findAll().then(contacts => {
				//console.log(contacts);
				return contacts;
			});
		}
      }
	,  
      contact: {
        type: ContactType,
		args: { id: {type: GraphQLInt }},
        resolve: (parentValue, args) => {
            return findByPK(args.id).then( contact => {
				console.log(contact);
				 return contact;
			});
        }
      }
	}
});

async function openDB() {
	let pool = null;
	try {
		pool = await new sql.ConnectionPool(config).connect();
		console.log("Connection open!");
	}
	catch (err) {
		console.log('Error: ', err);
	}
	
	return pool
}

async function closeDB(pool) {
	if (pool != null) {
		await pool.close();
	}
    console.log("Connection closed!");
}

async function findAll(){
	var rows = [];
	try {
		let pool = await openDB();
		console.log('Working!');
		var result = await pool.request().query('SELECT Id, LastName, FirstName, EMail FROM Contact;');
		rows = result.recordset;
		await closeDB(pool);
		//for (row of rows.recordset) {
		//	count++;
		//	console.log('Name: ' + row.LastName + ', ' + row.FirstName + '(' +  row.Id + ')');
		//}
	}
	catch (err) {
		console.log(err);
	}
	
	return rows;
};

async function findByPK(id){
	let row = null;
	try {
		let pool = await openDB();
		console.log('Working!');
		var result = await pool.request().query('SELECT Id, LastName, FirstName, EMail FROM Contact WHERE id=' + id + ';');
		row = result.recordset[0];
		await closeDB(pool);
	}
	catch (err) {
		console.log(err);
	}
	
	return row;
};

module.exports = new GraphQLSchema({
	query: RootQuery
});