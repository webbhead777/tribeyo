// imports
const firebase = require('firebase')
const admin = require('firebase-admin')
const displayFormat = require('../../utils/format')
const User = require('../schema/user').default

// FIREBASE INIT //
const serviceAccount = require('./serviceAccountKey.json')

firebase.initializeApp({
    apiKey: process.env.FIREBASE_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DB_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_SENDER_ID
})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
})

const db = admin.database()

exports.addNumber = (uid, purchasedNumber) => {
    return (
        this.getUserById(uid)
            .then(user => {
                const number = {
                    number: {
                        areaCode: {
                            code: areaCode,
                            display: format.displayAreaCode(areaCode)
                        },
                        forwardToNumber: {
                            display: format.displayNumber(forwardToNumber),
                            number: format.intNumber(forwardToNumber)
                        },
                        purchasedNumber: {
                            display: format.displayNumber(purchasedNumber),
                            number: format.intNumber(purchaseNumber)
                        }
                    }
                }
                // update user info in Firebase
                db.ref().child(`users/${uid}/twilio/number`).set(number)
            })
            .catch(err => console.log(err))
    )
}

exports.createUser = ({ email, password }) => (
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(({ uid }) => uid)
        .catch(err => console.log(err))
)

exports.getUserById = (uid) => {
    const ref = db.ref().child(`users/${uid}`)

    return (
        ref.once('value')
            .then(snapshot => {
                const user = snapshot.exportVal()
                if (!user) throw new Error('User not found!')
                return user
            })
            .catch(err => console.log(err))
    )
}

exports.loginEmail = (email, password) => (
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(({ uid }) => this.getUserById(uid))
        .catch(err => console.log(err))
)

exports.setStripeSubscription = (config) => {
    const ref = db.ref().child(`users/${config.id}/stripe/subscription`)

    return (
        ref.set(config)
            .then(() => true)
            .catch(err => console.log(err))
    )
}

exports.storeUser = (uid, config) => {
    const ref = db.ref().child(`users/${uid}`)
    const {
        description: name,
        email,
        id
    } = config[0]
    const { authToken, sid: accountSid } = config[1]
    const user = {
        ...User,
        email,
        name,
        twilio: {
            ...User.twilio,
            accountSid,
            authToken
        },
        stripe: {
            ...User.stripe,
            id
        },
        uid
    }
    ref.set(user)
        .catch(err => console.log(err))

    return user
}
