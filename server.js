const express = require('express')
const cors =require('cors');
const con=require('mysql');
const http =require("http");
const app = express();
const QRCode = require('qrcode');
const socketIO=require('socket.io');

const cookieParser = require('cookie-parser');
app.use(cookieParser());









// const base32 = require('base32-encode');
const { authenticator } = require('otplib');
var socketServer=http.createServer(app);
var io=socketIO(socketServer,{
     cors: {
          origin: '*',
        }
});




// for passkey

// const WebAuthn = require('webauthn')
// const webauthn = new WebAuthn({
//   origin: 'http://localhost:3000',
//   usernameField: 'username',
//   userFields: {
//     username: 'username',
//     name: 'displayName',
//   },
//   store: new LevelAdapter(),
//   rpName: 'Stranger Labs, Inc.',
//   enableLogging: false,
// })
// // 
const PORT = 55001;

socketServer.listen(PORT, ()=>{
     console.log('server is running on port:',PORT);
});



io.on('connection', (socket)=>{
    console.log('new device connect')
    socket.on("login",(data)=>{
     console.log('new login connect')
     socket.broadcast.emit( "receive_message" , data);
    })
    socket.on("logout",(data)=>{
     console.log('new logut connect')
     socket.broadcast.emit( "receive_message2" , data);
    })
});


// _________________Healaxy_________________
const statesAPI= require('./routes/states');
const countryAPI= require('./routes/country');
const whoAPI =require('./routes/who');
const bloodGroupAPI=require('./routes/bloodgroup');
const industryAPI=require('./routes/industry');
const referralAPI=require('./routes/referral');
const insuranceproviderAPI=require('./routes/insuranceprovider');
const languageAPI=require('./routes/language');
const masterresourceAPI=require('./routes/masterresource');
const masterformAPI=require('./routes/form');
const masterSmkoingStatus=require('./routes/smokingStatus')
const masterCity=require('./routes/masterCity')
const masterRelationship=require('./routes/relationship')
const masterGender=require('./routes/gender')
const masterOccupation =require('./routes/Occupation')
const sexualorientation=require('./routes/sexualorientation')
const maritalstatus=require('./routes/maritalstatus')
const mastersource=require('./routes/mastersource')
const UserRegistartion =require('./routes/UserRegistration')
const masterClinicSpecility=require('./routes/masterClinicspeciality');
const hospitalregistration=require('./routes/hospitalregistration');
const DICOM_UPLOAD_FILES = require('./routes/dicom_upload_files');
const ClinicOverview=require('./routes/ClinicOverview');
const currency =require('./routes/currency');
// const mediaUpload =require('./routes/mediaUpload')
const masterTreatment=require('./routes/masterTreatment')
const master_treatmentType=require('./routes/treatmentType');
const provider=require('./routes/provider');
const  SexualHistory=require('./routes/SexualHistory')
const alcoholAndSubstancesUse=require('./routes/AlcoholAndSubstancesUse')
const vitals=require('./routes/vitals')
const transactionProcedureHistory= require('./routes/transactionProcedureHistory')
const tobacco_use=require('./routes/tobacco_use')
const Alergies=require('./routes/alergies')
const literality= require('./routes/literality')
const problem=require('./routes/problem')
const Admision=require('./routes/AdmisionHistory')
const implantedDevices=require('./routes/implantesDevices')
const pharmacy=require('./routes/masterPharmacy');
const FamilyHistory=require('./routes/familyHIstory')
const MasterLabDepartment=require('./routes/masterLabDepartment')
const order=require('./routes/order')
const menu=require('./routes/menu')
const flowsheets=require('./routes/flowsheets')

// const paymentInformation=require('./routes/paymentInformation');

// _________________PHR APIs_________________
const phr_patient=require('./phr_routes/phr_patient');
const healthRecord=require('./phr_routes/healthrecord')
const patients_signature=require('./phr_routes/patients_signature')
const message= require('./phr_routes/message');
const patient_appointment= require('./phr_routes/patient_appointment')
const flowsheet=require('./phr_routes/flowsheets')





app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use('*',cors());
app.use('/flowsheets',flowsheets);
app.use('/states',statesAPI);
app.use('/country',countryAPI);
app.use('/who',whoAPI);
app.use('/bloodgroup',bloodGroupAPI);
app.use('/industry',industryAPI);
app.use('/referral',referralAPI);
app.use('/insuranceprovider',insuranceproviderAPI);
app.use('/language',languageAPI);
app.use('/Resource',masterresourceAPI);
app.use('/masterform',masterformAPI);
app.use('/smokingStatus',masterSmkoingStatus);
app.use('/mastercity',masterCity);
app.use('/masterRelationship',masterRelationship)
app.use('/gender',masterGender)
app.use('/Occupation',masterOccupation)
app.use('/sexualorientation',sexualorientation)
app.use('/maritalstatus',maritalstatus)
app.use('/mastersource',mastersource)
app.use('/masterpharmacy',pharmacy);
app.use('/UserRegistration',UserRegistartion);
app.use('/masterClinicSpecility',masterClinicSpecility);
app.use('/hospitalregistration',hospitalregistration);
app.use('/dicom_upload_files',DICOM_UPLOAD_FILES);
app.use('/clinicOverview',ClinicOverview);
app.use('/currency',currency)
// app.use('/mediaUpload',mediaUpload)
app.use('/masterTreatment',masterTreatment)
app.use('/master_treatmentType',master_treatmentType)
app.use('/menu',menu);
app.use('/provider',provider);
app.use('/Alergies',Alergies);
app.use('/literality',literality);
app.use('/transactionProcedureHistory',transactionProcedureHistory)
app.use('/tobacco_use',tobacco_use)
app.use('/SexualHistory',SexualHistory)
app.use('/alcoholAndSubstancesUse',alcoholAndSubstancesUse)
app.use('/vitals',vitals);
app.use('/problem',problem);
app.use('/Admision',Admision)
app.use('/implantedDevices',implantedDevices)
app.use('/FamilyHistory',FamilyHistory);
app.use('/MasterLabDepartment',MasterLabDepartment)
app.use('/order',order)





// _________________PHR APIs_________________

app.use('/phr_patient',phr_patient)
app.use('/patients_signature', patients_signature)
app.use('/messagephr', message)
app.use('/patient_appointment',patient_appointment)
app.use('/healthRecord',healthRecord);
app.use('/flowsheet',flowsheet)


  //    app.get('/generateSecretKey', (req, res) => {
  //         const secret = authenticator.generateSecret();
  // const otpUri = authenticator.keyuri('gargjirahul@gmail.com', 'healaxy', secret);
  
  // QRCode.toDataURL(otpUri, (err, qrCodeData) => {
  //   if (err) {
  //     console.error('Error generating QR code:', err);
  //     res.status(500).json({ error: 'Internal server error' });
  //   } else {
  //     res.json({ secret, otpUri, qrCodeData });
  //   }
  // });
  //       });
  // app.post('/generateSecretKey', (req, res) => {
  //   console.log(req.body,'generateSecretKey')
  //   var command = `select email_id from phr_login_details where guid='${req.body.patientId}'`;
  // try {
  //   console.log(command)
  //    execCommand(command);
  // } catch (error) {
  //   throw error;
  // }
  //   const secret = authenticator.generateSecret();

  //   const otpUri = authenticator.keyuri('gargjirahul@gmail.com', 'healaxy', secret);
  
  //   res.json({ secret, otpUri });
  // });

        // app.post('/verify', (req, res) => {
        //   const { token, secret } = req.body;
        //   const isValid = authenticator.check(token, secret);
        //   res.json({ isValid });
        
        // });




       
      
   
 