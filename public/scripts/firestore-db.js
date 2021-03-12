const userDetails  = document.querySelector('.userDetails')
const editProfile  = document.querySelector('#editProfile')

function createUserCollection(user){
   firebase.firestore().collection('users')
   .doc(user.uid)
   .set({
       uid:user.uid,
       name:user.displayName,
       email:user.email,
       phone:"",
       specialty:"",
       portfolioUrl:"",
       experience:""
   })
}


async function getuserInfo(userID){
    if(userID){
      const userInfoSnap = await  firebase.firestore()
    .collection('users')
    .doc(userID)
    .get()

   const userInfo = userInfoSnap.data()
   if(userInfo){
       userDetails.innerHTML = `
       <h3>${userInfo.name}</h3>
       <h3>${userInfo.email}</h3>
       <h3>${userInfo.phone}</h3>
       `
   }    
    }else{
        userDetails.innerHTML = `
        <h3>please login</h3>
        `
    }


}



async function getuserInfoRealtime(userID){
    if(userID){
      const userdocRef = await  firebase.firestore()
        .collection('users')
        .doc(userID)
        userdocRef.onSnapshot((doc)=>{
            if(doc.exists){
                 const userInfo = doc.data()
                    if(userInfo){
                        userDetails.innerHTML = `
                        <ul class="collection">
                          <li class="collection-item"><h4>${userInfo.name}</h4></li>
                          <li class="collection-item">${userInfo.email}</li>
                          <li class="collection-item">phone - ${userInfo.phone}</li>
                          <li class="collection-item">speciality -${userInfo.specialty}</li>
                          <li class="collection-item">Experience -${userInfo.experience}</li>
                          <li class="collection-item">portfolio - <a href="${userInfo.portfolioUrl}">open</li>
                        </ul>
                      
  


                        <button class="btn waves-effect #fbc02d yellow darken-2 modal-trigger" href="#modal3">edit details</button>   
                        `
                        editProfile["name"].value = userInfo.name
                        editProfile["profileEmail"].value = userInfo.email
                        editProfile["phoneno"].value = userInfo.phone
                        editProfile["specialty"].value = userInfo.specialty
                        editProfile["prorfolioUrl"].value = userInfo.portfolioUrl
                        editProfile["experience"].value = userInfo.experience

                        if(firebase.auth().currentUser.photoURL){
                            document.querySelector('#proimg').src = firebase.auth().currentUser.photoURL
                        }


                }    
             }
        })


    }else{
        userDetails.innerHTML = `
        <h3>please login</h3>
        `
    }
}


function updateUserProfile(e){
    e.preventDefault()
    const userDocRef =  firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)


    userDocRef.update({
        name:editProfile["name"].value,
        email:editProfile["profileEmail"].value,
        phone:editProfile["phoneno"].value,
        specialty:editProfile["specialty"].value,
        portfolioUrl:editProfile["prorfolioUrl"].value,
        experience:editProfile["experience"].value

    })

    M.Modal.getInstance(myModel[2]).close()
}


function uploadImage(e){
    console.log(e.target.files[0])
    const uid = firebase.auth().currentUser.uid
    const fileRef = firebase.storage().ref().child(`/users/${uid}/profile`)
    const uploadTask =  fileRef.put(e.target.files[0])
    uploadTask.on('state_changed', 
  (snapshot) => {
    
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    if(progress=='100') alert('uploaded')
  }, 
  (error) => {
   console.log(error)
  }, 
  () => {
    
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      console.log('File available at', downloadURL);
      document.querySelector('#proimg').src = downloadURL
      firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL
      })
    });
  }
);
}



async function allUserDetails(){
  document.getElementById('table').style.display='table'
  const userRef = await firebase.firestore().collection('users').get()  
  userRef.docs.forEach(doc=>{
           const info =   doc.data()
           document.getElementById('tbody').innerHTML += `
           <tr>
            <td>${info.name}</td>
            <td>${info.email}</td>
            <td>${info.phone}</td>
            <td>${info.specialty}</td>
            <td>${info.experience}</td>
            <td><a href="${info.portfolioUrl}">view</td>
          </tr>
           `
    })
 
  
  



}