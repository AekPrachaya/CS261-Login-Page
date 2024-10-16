/**
 * ฟังก์ชัน submitLogin ใช้สำหรับส่งข้อมูลการล็อกอินไปยัง API ของมหาวิทยาลัยธรรมศาสตร์
 * และแสดงผลลัพธ์ที่ได้จากการตรวจสอบข้อมูลการล็อกอิน
 *
 * @function submitLogin
 * @description
 * 1. ดึงค่าจากฟอร์ม username และ password
 * 2. เรียกใช้ API จาก TU เพื่อทำการตรวจสอบข้อมูลการล็อกอิน
 * 3. ตรวจสอบผลลัพธ์จาก API และแสดงข้อความที่เหมาะสมในหน้าเว็บ
 * 4. ถ้าข้อมูลการล็อกอินถูกต้อง จะแสดงข้อมูลเพิ่มเติมเกี่ยวกับผู้ใช้
 * 5. ถ้าข้อมูลการล็อกอินไม่ถูกต้อง จะแสดงข้อความแจ้งเตือน
 * 6. ถ้ามีข้อผิดพลาดในการเรียกใช้ API จะแสดงข้อความแจ้งเตือน
 */
function submitLogin() {
    const username = document.getElementById('username').value; // ดึงค่าจากฟอร์ม username
    const password = document.getElementById('password').value; // ดึงค่าจากฟอร์ม password

    console.log("Logging in..."); // ตรวจสอบว่าฟังก์ชันถูกเรียก

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', { // เรียกใช้ API จาก TU 
        method: 'POST', 
        headers: {
            'Application-Key': 'TUe90207acada738849d59d3b440cd4dd21d247031029244997b3d6244064983132274571c0d08883c983abaa49d57fc02', 
            'Content-Type': 'application/json' // กำหนด Content-Type เป็น JSON
        },
        body: JSON.stringify({ // ส่งข้อมูลเป็น JSON ไปยัง API 
            "UserName": username,
            "PassWord": password
        })
    })
    .then(response => response.json())
    .then(data => {  
        const messageElement = document.getElementById('message'); // ดึงข้อมูลจาก HTML โดยใช้ ID
        console.log(data.message);
        
        // ลบสไตล์ก่อนหน้าทั้งหมด
        messageElement.classList.remove('success', 'fail');
        
        // ตรวจสอบข้อมูลจาก API
        if (data.message.toLowerCase().includes("success")) {
            messageElement.innerText = 'Success !';
            messageElement.classList.add('success');
            
            // ตรวจสอบประเภทนักศึกษา หรือบุคลากร
            let resultMessage = '';
            if (data.type === 'student') {
                // ถ้าเป็นนักศึกษา แสดง Type, displayname_th, Faculty, และ Department
                resultMessage = `
                    Type: ${data.type}
                    Display Name: ${data.displayname_th}
                    Faculty: ${data.faculty}
                    Department: ${data.department}
                `;
            } else if (data.type === 'employee') {
                // ถ้าเป็นบุคลากร แสดง Type, displayname_th, Organization, และ Department
                resultMessage = `
                    Type: ${data.type}
                    Display Name: ${data.displayname_th}
                    Organization: ${data.organization}
                    Department: ${data.department}
                `;
            }

            console.log(resultMessage); // แสดงผลใน Console
            alert(resultMessage); // แสดงผลข้อมูลที่ต้องการด้วย Alert
        } else {
            messageElement.innerText = 'Invalid Username or Password !';
            messageElement.classList.add('fail');
        }

        console.log(data); // Debug ดูผลจาก API
    })
    .catch(error => {
        console.error('Error:', error);
        const messageElement = document.getElementById('message');
        messageElement.innerText = 'Invalid Username or Password !';
        messageElement.classList.remove('success');
        messageElement.classList.add('fail');
    });
}