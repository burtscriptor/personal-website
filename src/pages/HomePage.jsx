import '../css/HomePage.css'
const HomePage = () => {
    return (
        <>
        <div className='container'>
            <div className='avatar'>
                <img src='./src/assets/avatarButnot.jpg' alt='A photo of Dave'></img>
            </div>
            <div className='textContainer'>
                <div className='typed-out'>
                    <p>I worked in healthcare for close to a decade, helping people is a noble cause, now I want to help you 
                        develop software systems
                    </p>
                </div>    
            </div>

        </div>
        </>
    )
}

export default HomePage;