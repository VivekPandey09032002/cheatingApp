export default function getDate() {
    let date_time = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour12 : true };
    let ans = date_time.toLocaleString('en-US', options)
    let ans2 = date_time.toLocaleTimeString('en-US')
    return ans +" "+ ans2;
}