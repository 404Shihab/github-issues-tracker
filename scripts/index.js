document.getElementById('btn-login').addEventListener('click',function()
{
    // 1. Get the mobile number input
    const unameInput = document.getElementById('input-uname');
    const username = unameInput.value;
    console.log(username);
    // 2. Get the pin input
    const pinInput= document.getElementById('input-pass');
    const password = pinInput.value;
    console.log(password);
    // 3. Match mobile number and pin
    if(username == "admin" && password == "admin123")
        {// 3- true: homepage
        alert('Login Success!!')
        // window.location.replace("/home.html");
        window.location.assign("./home.html");
        }
    
    // 3- false: return
    else{
        alert('Login Failed');
        return; 
    }
        
})