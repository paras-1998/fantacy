import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import moment from 'moment';
import jwt from "jsonwebtoken";
import { min, sample, shuffle, random } from 'underscore';

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

import mongoose from 'mongoose';
import { Console } from "node:console";

await mongoose.connect('mongodb://fantacyuser:newrfantacypass@localhost:27017/fantacy?authSource=admin');
// await mongoose.connect('mongodb://localhost:27017/fantacy?authSource=admin');

const Schema = mongoose.Schema;


// Program part start --------
const calculateCurrentSession2 = () => {
  const now = moment().utcOffset("+05:30");
  const minutesA = Math.floor(now.minutes() / 2) * 2; // Align to the nearest even minute for Session A
  const startA = now.clone().startOf('hour').add(minutesA, 'minutes');
  const endA = startA.clone().add(2, 'minutes');
  const differenceInSeconds = endA.diff(now, 'seconds');
  /* const startB = startA.clone().add(1, 'minute'); // Session B starts 1 minute after A
  const endB = startB.clone().add(2, 'minutes'); */
  return { startTime: startA, endTime: endA, endInsec: differenceInSeconds, now: now, sessionId: `A-${startA.format('HH:mm')}` };
};




const calculateCurrentSession = () => {
  const now = moment().utcOffset("+05:30");
  const minutesB = Math.floor(now.minutes() / 5) * 5; // Align to the nearest 5-minute interval
  const startB = now.clone().startOf('hour').add(minutesB, 'minutes');
  const endB = startB.clone().add(5, 'minutes');
  const differenceInSeconds = endB.diff(now, 'seconds');
  return {
    startTime: startB,
    endTime: endB,
    endInsec: differenceInSeconds,
    now: now,
    sessionId: `B-${startB.format('HH:mm')}`
  };
};









const ObjectId = Schema.ObjectId;

const Sessions = new Schema({
  startTime: Date,
  endTime: Date,

  Shree: { type: Number, default: 0 },
  Vashikaran: { type: Number, default: 0 },
  Sudarshan: { type: Number, default: 0 },
  Vastu: { type: Number, default: 0 },
  Planet: { type: Number, default: 0 },
  Love: { type: Number, default: 0 },
  Tara: { type: Number, default: 0 },
  Grah: { type: Number, default: 0 },
  Matsya: { type: Number, default: 0 },
  Meditation: { type: Number, default: 0 },


  ShreeAmount: { type: Number, default: 0 },
  VashikaranAmount: { type: Number, default: 0 },
  SudarshanAmount: { type: Number, default: 0 },
  VastuAmount: { type: Number, default: 0 },
  PlanetAmount: { type: Number, default: 0 },
  LoveAmount: { type: Number, default: 0 },
  TaraAmount: { type: Number, default: 0 },
  GrahAmount: { type: Number, default: 0 },
  MatsyaAmount: { type: Number, default: 0 },
  MeditationAmount: { type: Number, default: 0 },

  totalAmount: { type: Number, default: 0 },
  totalQty: { type: Number, default: 0 },
  payout: { type: Number, default: 0 },

  winner: { type: [String], default: [] },
  winnerType: { type: String, default: "", enum: ["2X", "3X", "1X", ""] },

  isDone: {
    type: Number,
    enum: [0, 1], // 0 -> no , 1-> yes
    default: 0,
  },

  createdDate: { type: Date, default: Date.now },

});
const SessionsModel = mongoose.model('sessions', Sessions);

const Tickets = new Schema({
  session: ObjectId,
  user: ObjectId,


  ticketNo: { type: Number },

  Shree: { type: Number },
  Vashikaran: { type: Number },
  Sudarshan: { type: Number },
  Vastu: { type: Number },
  Planet: { type: Number },
  Love: { type: Number },
  Tara: { type: Number },
  Grah: { type: Number },
  Matsya: { type: Number },
  Meditation: { type: Number },


  ShreeAmount: { type: Number },
  VashikaranAmount: { type: Number },
  SudarshanAmount: { type: Number },
  VastuAmount: { type: Number },
  PlanetAmount: { type: Number },
  LoveAmount: { type: Number },
  TaraAmount: { type: Number },
  GrahAmount: { type: Number },
  MatsyaAmount: { type: Number },
  MeditationAmount: { type: Number },

  totalAmount: { type: Number, default: 0 },
  totalQty: { type: Number, default: 0 },

  isClaimed: {
    type: Number,
    enum: [0, 1], // 0 -> no , 1-> yes
    default: 0,
  },
  isCancel: {
    type: Number,
    enum: [0, 1], // 0 -> no , 1-> yes
    default: 0,
  },

  createdDate: { type: Date, default: Date.now },


});
Tickets.index({ ticketNo: 'min' });
Tickets.pre('save', async function (doc, next) {
  const tickets = this;
  tickets.ticketNo = (await tickets.model().countDocuments({})) + 111000;
});
const TicketsModel = mongoose.model('tickets', Tickets);


const Configs = new Schema({
  commissionPercentage: { type: Number, default: 0 },
});
const ConfigsModel = mongoose.model('configs', Configs);

const getConfigCommissionPercentage = async () => {
  const config = await ConfigsModel.findOne({}, "commissionPercentage").lean();
  return config ? config.commissionPercentage : 0;
};


const Transactions = new Schema({

  user: ObjectId,

  dt: { type: String }, // date 

  ar: { type: Number, default: 0 }, // admin recharege

  ob: { type: Number }, // opneing balance
  ar: { type: Number, default: 0 }, // closing balance
  cb: { type: Number, default: 0 }, // closing balance

  ap: { type: Number, default: 0 }, // agent purchese
  aw: { type: Number, default: 0 }, // agent win
  aComm: { type: Number, default: 0 }, // agent commision


  aPay: { type: Number, default: 0 }, // admin pay
  createdDate: { type: Date, default: Date.now },


});
const TransactionsModel = mongoose.model('transactions', Transactions);


const Users = new Schema({
  username: { type: String }, // date 
  balance: { type: Number, default: 0 }
});
const UsersModel = mongoose.model('users', Users);

const winnerbord = async () => {
  let now = new Date();
  let past12Hr = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  // Round minutes to nearest 0 or 20
  let minutes = past12Hr.getMinutes();
  past12Hr.setMinutes(minutes < 15 ? 0 : minutes < 45 ? 20 : 0);
  if (minutes >= 45) {
    past12Hr.setHours(past12Hr.getHours() + 1); // round up hour if minutes >= 45 and set to :00
  }
  past12Hr.setSeconds(0);
  past12Hr.setMilliseconds(0);
  //let dt =  new Date( new Date().getTime() - ( ( 24 ) * 60 * 60 * 1000  ) );// offset is nuber of house
//   return await SessionsModel.find(
//     {
//         endTime: {
//             $gte: past12Hr,
//             $lte: new Date(), // <= current time
//         },
//         winnerType: { $ne: "" },
//         isDone: 1,
//     },
//     "winner winnerType endTime"
// )
// // .sort({ endTime: -1 }) // latest record first
// .lean();
return await SessionsModel.find({
  endTime: {
    $gte: past12Hr,
    $lte: new Date()
  },
  winnerType: { $ne: "" },
  isDone: 1,
  $expr: {
    $in: [{ $minute: "$endTime" }, [0, 20]]
  }
})
.sort({ endTime: -1 })
.lean();

};

// Program part End --------

const winPriceforSingleticket = 100; // Price per ticket

// Step 2: Helper function to calculate total payout for a group of cards
function calculateGroupPayout(winningType, cardGroup, ticketsData) {
  const multiplier = winningType === "1X" ? 1 : winningType === "2X" ? 2 : 3;
  let groupPayout = 0;

  cardGroup.forEach((card) => {
    groupPayout += winPriceforSingleticket * ticketsData[card] * multiplier;
  });

  return groupPayout;
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function getLastWinner() {
  // Find the last session with a winner, sorted by createdDate DESC
  const lastSession = await SessionsModel.findOne({})
    .sort({ createdDate: -1 })
    .lean();

  if (!lastSession || !lastSession.winner) return [];

  // Assuming lastSession.card is an array of winning cards
  return lastSession.winner;
}

// Step 3: Find a random single winning group
async function getRandomWinningGroup(soldTickets, distributionAmount) {
  console.log(soldTickets, distributionAmount)
  const ticketEntries = shuffleArray(Object.entries(soldTickets)); // Shuffle tickets
  let validOptions = [];
  const lastWinner = await getLastWinner();
  // Iterate over all possible combinations
  for (let i = 0; i < ticketEntries.length; i++) {
    for (let j = i; j < ticketEntries.length; j++) {
      for (let k = j; k < ticketEntries.length; k++) {
        const cardGroup = [
          ticketEntries[i][0],
          ...(j !== i ? [ticketEntries[j][0]] : []),
          ...(k !== j && k !== i ? [ticketEntries[k][0]] : []),
        ];

        // Determine the allowed winning type
        //const winningTypes = cardGroup.length > 1 ? ["1X"] : sample(["1X", "2X", "3X"],random(1,3));
        //const winningTypes = cardGroup.length > 1 ? ["1X"] : ["1X", "2X", "3X"];
        if (cardGroup.length > 1) { continue; }
        const winningTypes = ["1X"];
        //console.log(" winningTypes ",winningTypes)
        for (const winningType of winningTypes) {
          const groupPayout = calculateGroupPayout(winningType, cardGroup, soldTickets);

          if (groupPayout <= distributionAmount) {
            const isDuplicate = cardGroup.some(card => lastWinner.includes(card));
            if (isDuplicate) continue;

            validOptions.push({
              card: cardGroup,
              type: winningType,
              payout: groupPayout,
            });
          }
        }
      }
    }
  }
  //console.log("validOptions------------- ")
  /* for(let A of validOptions){
    console.log(A)
  } */
  // Randomly pick one from valid options
  return validOptions.length > 0
    ? sample(shuffleArray(validOptions))
    : null;
}


//  Handel undeclare 
const HandelUndeclare = async () => {
  let undeclareSessions = await SessionsModel.find({ winnerType: "", isDone: 0 },).lean();
  for (let soldTickets of undeclareSessions) {
    if (soldTickets && soldTickets.winnerType === "" && soldTickets.isDone == 0) {
      let keyadd = ["Shree", "Vashikaran", "Sudarshan", "Vastu", "Planet", "Love", "Tara", "Grah", "Matsya", "Meditation"];
      let _soldTickets = {};
      let sessionId = soldTickets._id;
      const totalAmount = soldTickets.totalAmount; // Total sales amount

      const commissionPercentage = await getConfigCommissionPercentage();  // Commission percentage

      for (let rk of keyadd) {
        if (soldTickets[rk] > 0) {
          _soldTickets[rk] = soldTickets[rk];
        }
      }

      const lastSession = await SessionsModel.findOne({ winner: { $exists: true, $ne: [] } })
        .sort({ createdDate: -1 })
        .lean();
      const lastWinner = lastSession?.winner || [];
      // Step 1: Calculate distribution amount
      const commissionAmount = (totalAmount * commissionPercentage) / 100;
      const distributionAmount = totalAmount - commissionAmount;

      const sortedKeys = Object.entries(_soldTickets)
        // 1️⃣ only values <= distributionAmount
        .filter(([_, value]) => value <= distributionAmount)
        // 2️⃣ sort DESC (nearest first)
        .sort((a, b) => b[1] - a[1])
        // 3️⃣ take only keys
        .map(([key]) => key);

      // 4️⃣ pick first key not in last winner
      const lowestKey = sortedKeys.find(
        (k) => !lastWinner.includes(k)
      ) || null;
      // const lowestKey = min(Object.entries(_soldTickets), ([, value]) => value)?.[0];

      const sortedSoldTicket = {};
      let hasFilteredData = false;


      Object.entries(_soldTickets)
        .map(([key, count]) => ({
          key,
          payout: count * winPriceforSingleticket,
          count
        }))
        .filter(item => {

          const isValid =
            item.payout - (item.payout * commissionPercentage) / 100 <=
            distributionAmount * winPriceforSingleticket;
          if (isValid) hasFilteredData = true; // ✅ track filter result
          return isValid;
        })
        .sort((a, b) => b.payout - a.payout) // nearest first
        .forEach(item => {
          if (!lastWinner.includes(item.key)) {
            sortedSoldTicket[item.key] = item.count;
          }
        });
      // ✅ FINAL RESULT

      const sortedSoldTickets = hasFilteredData
        ? sortedSoldTicket
        : _soldTickets;

      console.log("finalSoldTickets111", sortedSoldTickets, sortedSoldTicket)
      const randomWinningGroup = await getRandomWinningGroup(sortedSoldTickets, distributionAmount);
      console.log("randomWinningGroup", randomWinningGroup)
      if (randomWinningGroup && randomWinningGroup != null) {
        await SessionsModel.updateOne({ _id: sessionId }, { $set: { winner: randomWinningGroup.card, winnerType: randomWinningGroup.type, payout: randomWinningGroup.payout, isDone: 1 } });
      }
      else {
        for (let rk of keyadd) {
          _soldTickets[rk] = soldTickets[rk];
        }

        const filteredSoldTickets = Object.fromEntries(
          Object.entries(_soldTickets).filter(
            ([key]) => !lastWinner.includes(key)
          )
        );

        const randomWinningGroup1 = await getRandomWinningGroup(filteredSoldTickets, distributionAmount);
        if (randomWinningGroup1 && randomWinningGroup1 != null) {
          await SessionsModel.updateOne({ _id: sessionId }, { $set: { winner: randomWinningGroup1.card, winnerType: randomWinningGroup1.type, payout: randomWinningGroup1.payout, isDone: 1 } });
        }
        else if (lowestKey) {
          let payoutLowKey = soldTickets[lowestKey] * winPriceforSingleticket;
          await SessionsModel.updateOne({ _id: sessionId }, { $set: { winner: [lowestKey], winnerType: "1X", payout: payoutLowKey, isDone: 1 } });
        }
      }
    }
    else if (soldTickets && soldTickets.winnerType !== "") {
      let x = (soldTickets.winnerType === "3X" ? 3 : (soldTickets.winnerType === "2X" ? 2 : 1));
      let payout = 0;
      for (let card of soldTickets.winner) {
        payout += (soldTickets[card] * x * winPriceforSingleticket);
      }
      await SessionsModel.updateOne({ _id: soldTickets._id }, { $set: { isDone: 1, payout: payout } });
    }
    else {
      /* let keyadd = ["Shree","Vashikaran","Sudarshan","Vastu","Planet","Love","Tara","Grah","Matsya","Meditation"];
      const lowestKey = sample(shuffle(keyadd));
      const winnerType = "1X";
      await SessionsModel.updateOne({_id:soldTickets._id},{ $set : { winner :[lowestKey] ,winnerType: winnerType , isDone  : 1  }}); */
      let keyadd = sample(["Shree", "Vashikaran", "Sudarshan", "Vastu", "Planet", "Love", "Tara", "Grah", "Matsya", "Meditation"]);
      const lastWinner = await SessionsModel.findOne({}, { winner: 1 }).sort({ _id: -1 }).lean();
      let filteredKeys = keyadd;
      if (lastWinner && lastWinner.winner && lastWinner.winner.length > 0) {
        filteredKeys = keyadd.filter(key => !lastWinner.winner.includes(key));
      }
      const lowestKey = sample(filteredKeys.length ? filteredKeys : keyadd);
      await SessionsModel.updateOne({ _id: soldTickets._id }, { $set: { winner: [lowestKey], winnerType: winnerType, isDone: 1 } });
    }
  }
};
HandelUndeclare()

const createSession = async () => {
  let currentSession = calculateCurrentSession();
  let soldTickets = await SessionsModel.findOne({
    startTime: currentSession.startTime,
    endTime: currentSession.endTime
  }).lean();
  if (!soldTickets) {
    await SessionsModel.create({
      startTime: currentSession.startTime,
      endTime: currentSession.endTime
    });
  }
}
createSession();
app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.engine.use(async (req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (!isHandshake) {
      const rnd = random(1, 100);
      if (!(rnd < 50 && rnd > 40)) {
        return next();
      }
    }

    const header = req.headers["authorization"];


    if (!header) {
      return next(new Error("no token"));
    }

    if (!header.startsWith("bearer ")) {
      return next(new Error("invalid token"));
    }

    const token = header.substring(7);
    const _decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (_decoded.id) {
      let user = await UsersModel.findById(_decoded.id, "status activeSession").lean();
      if (!user || user.activeSession !== token) {
        return next(new Error("Invalid or expired session.."));
      }
      if (user.status !== 1) {
        return next(new Error("deactivated account."));
      }
      req.user = _decoded;
      next();
    }
    else {
      return next(new Error("invalid token"));
    }
  });


  setInterval(async () => {
    let currentSession = calculateCurrentSession();
    io.emit('currentSession', currentSession);
    console.log("currentSession-> " + currentSession.endInsec)

    if (currentSession.endInsec == 285) {
      createSession();
    }

    console.log("currentSession.endInsec", currentSession.endInsec)

    if (currentSession.endInsec == 3 || currentSession.endInsec == 1) {
      let soldTickets = await SessionsModel.findOne({
        startTime: currentSession.startTime,
        endTime: currentSession.endTime
      }).lean();
      console.log("----------> ", soldTickets);
      if (soldTickets && soldTickets.winnerType === "" && soldTickets.isDone == 0) {
        console.log("A")
        let keyadd = shuffle(["Shree", "Vashikaran", "Sudarshan", "Vastu", "Planet", "Love", "Tara", "Grah", "Matsya", "Meditation"]);
        let _soldTickets = {};
        let sessionId = soldTickets._id;
        const totalAmount = soldTickets.totalAmount; // Total sales amount

        const commissionPercentage = await getConfigCommissionPercentage();  // Commission percentage

        for (let rk of keyadd) {
          if (soldTickets[rk] > 0) {
            _soldTickets[rk] = soldTickets[rk];
          }
        }
        const lastSession = await SessionsModel.findOne({ winner: { $exists: true, $ne: [] } })
          .sort({ createdDate: -1 })
          .lean();
        const lastWinner = lastSession?.winner || [];
        // Step 1: Calculate distribution amount
        const commissionAmount = (totalAmount * commissionPercentage) / 100;
        const distributionAmount = totalAmount - commissionAmount;

        const sortedKeys = Object.entries(_soldTickets)
          // 1️⃣ only values <= distributionAmount
          .filter(([_, value]) => value <= distributionAmount)
          // 2️⃣ sort DESC (nearest first)
          .sort((a, b) => b[1] - a[1])
          // 3️⃣ take only keys
          .map(([key]) => key);

        // 4️⃣ pick first key not in last winner
        const lowestKey = sortedKeys.find(
          (k) => !lastWinner.includes(k)
        ) || null;
        // const lowestKey = min(Object.entries(_soldTickets), ([, value]) => value)?.[0];

        const sortedSoldTicket = {};
        let hasFilteredData = false;

        console.log("_soldTickets_soldTickets", _soldTickets);

        Object.entries(_soldTickets)
          .map(([key, count]) => ({
            key,
            payout: count * winPriceforSingleticket,
            count
          }))
          .filter(item => {
            const isValid =
              item.payout - (item.payout * commissionPercentage) / 100 <=
              distributionAmount * winPriceforSingleticket;

            if (isValid) hasFilteredData = true; // ✅ track filter result
            return isValid;
          })
          .sort((a, b) => b.payout - a.payout) // nearest first
          .forEach(item => {
            if (!lastWinner.includes(item.key)) {
              sortedSoldTicket[item.key] = item.count;
            }
          });

        // ✅ FINAL RESULT
        const sortedSoldTickets = hasFilteredData
          ? sortedSoldTicket
          : _soldTickets;

        console.log("sortedSoldTickets111113", sortedSoldTickets, sortedSoldTicket)

        const randomWinningGroup = await getRandomWinningGroup(sortedSoldTickets, distributionAmount);

        if (randomWinningGroup && randomWinningGroup != null) {
          console.log("AA")
          await SessionsModel.updateOne({ _id: sessionId }, { $set: { winner: randomWinningGroup.card, winnerType: randomWinningGroup.type, payout: randomWinningGroup.payout, isDone: 1 } });
          io.emit('onwinner', randomWinningGroup);
        }
        else {
          console.log("BB")
          for (let rk of keyadd) {
            _soldTickets[rk] = soldTickets[rk];
          }

           const filteredSoldTickets = Object.fromEntries(
          Object.entries(_soldTickets).filter(
            ([key]) => !lastWinner.includes(key)
          )
        );

          const randomWinningGroup1 = await getRandomWinningGroup(filteredSoldTickets, distributionAmount);
          if (randomWinningGroup1 && randomWinningGroup1 != null) {
            console.log("BB11 ", randomWinningGroup1)
            await SessionsModel.updateOne({ _id: sessionId }, { $set: { winner: randomWinningGroup1.card, winnerType: randomWinningGroup1.type, payout: randomWinningGroup1.payout, isDone: 1 } });
            io.emit('onwinner', randomWinningGroup1);
          }
          else if (lowestKey) {
            console.log("BB22")
            let payoutLowKey = soldTickets[lowestKey] * winPriceforSingleticket;
            await SessionsModel.updateOne({ _id: sessionId }, { $set: { winner: [lowestKey], winnerType: "1X", payout: payoutLowKey, isDone: 1 } });
            io.emit('onwinner', { card: [lowestKey], type: "1X", payout: payoutLowKey });
          }
        }
      }
      else if (soldTickets && soldTickets.winnerType !== "") {
        console.log("B")
        let x = (soldTickets.winnerType === "3X" ? 3 : (soldTickets.winnerType === "2X" ? 2 : 1));
        let payout = 0;
        for (let card of soldTickets.winner) {
          payout += (soldTickets[card] * x * winPriceforSingleticket);
        }
        await SessionsModel.updateOne({ _id: soldTickets._id }, { $set: { isDone: 1, payout: payout } });
        io.emit('onwinner', { card: soldTickets.winner, type: soldTickets.winnerType, payout: payout });
      }
      else if (!soldTickets) {
        console.log("C")
        let session = await SessionsModel.create({
          startTime: currentSession.startTime,
          endTime: currentSession.endTime
        });
        let sessionId = session._id;
        let keyadd = ["Shree", "Vashikaran", "Sudarshan", "Vastu", "Planet", "Love", "Tara", "Grah", "Matsya", "Meditation"];
        //const lowestKey = sample(shuffle(keyadd));

        const lastSession = await SessionsModel.findOne({ winner: { $exists: true, $ne: [] } })
          .sort({ createdDate: -1 })
          .lean();
        const lastWinner = lastSession?.winner || [];
        const availableKeys = keyadd.filter(key => !lastWinner.includes(key));

        // 🔹 Pick a random key from availableKeys
        const lowestKey = availableKeys.length > 0 ? sample(availableKeys) : null;

        const winnerType = "1X";

        await SessionsModel.updateOne({ _id: sessionId }, { $set: { winner: [lowestKey], winnerType: winnerType, isDone: 1 } });
        io.emit('onwinner', { card: [lowestKey], type: winnerType, payout: 0 });
      } else {
        console.log("E")
      }
    }
  }, 1000);



  io.on("connection", (socket) => {
    // ...



    socket.on("hello", (arg, callback) => {
      callback("got it");
    });

    socket.on("winnerbord", async () => {
      socket.emit('winnerbord', await winnerbord());
    });
    socket.on("saveTicket", async (order, callback) => {
      const userId = socket.request.user.id;
      let user = await UsersModel.findById(userId, "balance").lean();
      if (Object.keys(order).length) {
        let totalQty = 0, totalAmount = 0;
        let amounts = {};
        for (let odr in order) {
          amounts[odr + "Amount"] = (order[odr] * 11);
          totalQty += order[odr];
          totalAmount += (order[odr] * 11)
        }
        //check user balance
        if (user.balance >= totalAmount) {
          const currentSession = calculateCurrentSession();

          let currentSessionData = await SessionsModel.findOne({
            startTime: currentSession.startTime,
            endTime: currentSession.endTime
          }).lean();
          let sessionId;
          if (currentSessionData) {
            // update
            sessionId = currentSessionData._id;
            await SessionsModel.updateOne(
              { _id: sessionId },
              {
                $inc: {
                  totalQty,
                  totalAmount,
                  ...amounts,
                  ...order
                }
              }
            );
          }
          else {
            // Create new session data
            let session = await SessionsModel.create({
              startTime: currentSession.startTime,
              endTime: currentSession.endTime,
              totalQty,
              totalAmount,
              ...amounts,
              ...order
            })
            sessionId = session._id;
          }
          await UsersModel.updateOne({ _id: userId }, { $inc: { balance: -totalAmount } });
          let ticket = await TicketsModel.create({
            user,
            session: sessionId,
            totalQty,
            totalAmount,
            ...amounts,
            ...order
          });

          const todayDT = moment().format('DD-MM-YYYY');

          //Find transction
          let todayTransactions = await TransactionsModel.findOne({ dt: todayDT, user: userId }, "_id").lean();
          if (todayTransactions) {
            //Update record
            await TransactionsModel.updateOne(
              { _id: todayTransactions._id },
              {
                $inc: {
                  cb: -totalAmount,
                  ap: totalAmount
                }
              }
            );
          }
          else {
            // Add new
            await TransactionsModel.create({
              dt: todayDT,
              user: userId,

              ob: user.balance,
              cb: (user.balance - totalAmount),

              ap: totalAmount, // agent purchese

            });
          }

          callback({ ticket, order, currentSession });
        }
        else {
          callback("Insufficient Balance!");
        }
      }
      else {
        callback("Please Enter Yantra.");
      }
    });
    socket.on("cancelTicket", async (ticketId, callback) => {
      const userId = socket.request.user.id;
      const ticket = await TicketsModel.findOne({ _id: ticketId, user: userId }).lean();
      if (ticket) {
        const sessionId = ticket.session;
        let keyRemove = ["_id", "session", "isClaimed", "createdDate", "ticketNo", "__v", "user"];
        let lastAmt = ticket.totalAmount;
        for (let rk of keyRemove) {
          delete ticket[rk];
        }
        for (let rk in ticket) {
          ticket[rk] = ticket[rk] * -1;
        }
        await SessionsModel.updateOne({ _id: sessionId }, { $inc: ticket });
        await TicketsModel.updateOne({ _id: ticketId }, { $set: { isCancel: 1 } });
        //await TicketsModel.deleteOne({_id:ticketId});

        const todayDT = moment().format('DD-MM-YYYY');
        let user = await UsersModel.findById(userId, "balance").lean();
        await UsersModel.updateOne({ _id: userId }, { $inc: { balance: lastAmt } });
        let todayTransactions = await TransactionsModel.findOne({ dt: todayDT, user: userId }, "_id").lean();
        if (todayTransactions) {
          await TransactionsModel.updateOne(
            { dt: todayDT, user: userId },
            {
              $inc: {
                ap: -lastAmt
              },
              $set: {
                cb: (user.balance + lastAmt),
              }
            }
          );
        }
        else {
          await TransactionsModel.create({
            dt: todayDT,
            user: userId,

            ob: user.balance,
            cb: (user.balance + lastAmt),
            ap: lastAmt, // agent purchese

          });
        }

        callback({ lastamount: lastAmt });
      }
      else {
        callback("Something went wrong.");
      }

    });
    socket.on("validateTicket", async (ticketNo, callback) => {
      if (parseInt(ticketNo) > 0) {
        const userId = socket.request.user.id;
        //let user = await UsersModel.findById(userId,"balance").lean();
        const ticket = await TicketsModel.findOne({ ticketNo: ticketNo, user: userId, isCancel: 0 }).lean();
        if (ticket && ticket.isClaimed == 0) {
          let sessionData = await SessionsModel.findById(ticket.session, "winnerType winner").lean();
          if (sessionData && sessionData.winnerType !== "" && sessionData.winner.length > 0) {

            let order = [];
            let totalAmount = 0;
            for (let sk of sessionData.winner) {
              //delete ticket[rk];
              if (ticket[sk]) {
                let amt = (ticket[sk] * 100) * (sessionData.winnerType == "3X" ? 3 : (sessionData.winnerType == "2X" ? 2 : 1));
                totalAmount += amt;
                order.push({ yantra: sk, qty: ticket[sk] * (sessionData.winnerType == "3X" ? 3 : (sessionData.winnerType == "2X" ? 2 : 1)) })
              }
            }
            if (order.length > 0) {
              const todayDT = moment().format('DD-MM-YYYY');
              let user = await UsersModel.findById(userId, "balance").lean();
              let todayTransactions = await TransactionsModel.findOne({ dt: todayDT, user: userId }, "_id").lean();
              if (todayTransactions) {
                await TransactionsModel.updateOne(
                  { dt: todayDT, user: userId },
                  {
                    $inc: {
                      aw: totalAmount
                    },
                    $set: {
                      cb: parseInt(user.balance + totalAmount),
                    }
                  }
                );
              }
              else {
                await TransactionsModel.create({
                  dt: todayDT,
                  user: userId,

                  ob: user.balance,
                  cb: parseInt((user.balance + totalAmount)),
                  aw: totalAmount, // agent purchese
                });
              }

              await UsersModel.updateOne({ _id: userId }, { $inc: { balance: totalAmount } });
              await TicketsModel.updateOne({ _id: ticket._id }, { $set: { isClaimed: 1 } });
              callback({ order, ticket, sessionData, totalAmount });
            }
            else {
              callback("No winning ticket.");
            }
          }
          else {
            callback("Pending.");
          }
        }
        else if (ticket && ticket.isClaimed == 1) {
          callback("Ticket Already Claimed.");
        }
        else {
          callback("Invalid TicketNo.");
        }
      }
      else {
        callback("Invalid TicketNo.");
      }

    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, '0.0.0.0', () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
