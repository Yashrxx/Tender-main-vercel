import './About.css'
import Yash from '../assets/img/WhatsApp Image 2025-06-28 at 5.10.49 PM.jpeg'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useEffect, useState } from 'react';

const About = (props) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = Yash;
        img.onload = () => setImgLoaded(true);
    }, []);

    if (!imgLoaded) {
        return (
            <div className='abt' style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>Loading...</p>
            </div>
        );
    }
    return (
        <div className='abt'>
            <div className="imgh">
                <img className='adz' src={Yash} alt="Error 404" />
            </div>
            <div className="conth">
                <div className="txtmy">
                    <h2 style={{ color: props.mode === 'dark' ? 'white' : 'black', fontWeight: "bold" }}>About Me</h2>
                    <h1 style={{ color: "#D91747", fontWeight: "bold" }}>FullStack Developer</h1>
                    <p style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>Hi, I’m a passionate full-stack web developer who recently transitioned my love for coding into a full-time profession. I specialize in building modern, scalable web applications that not only look great but also perform seamlessly. From intuitive frontend designs to efficient backend logic, I craft digital experiences with clean code, thoughtful architecture, and user-centric functionality—because great software should feel effortless and empowering.</p>
                </div>
                <div className="contactInfo" style={{ color: props.mode === 'dark' ? 'thistle' : 'black' }}>
                    <div className="ci-1">
                        <p><FiberManualRecordIcon fontSize='small' />  Name : Yash Jain</p>
                        <p><FiberManualRecordIcon fontSize='small' />  Email : yashsushillunkad313@gmail.com</p>
                        <p><FiberManualRecordIcon fontSize='small' />  ph-no : 9840670184</p>
                    </div>
                    <div className="ci-2">
                        <div className="ci-12" style={{ display: "flex", flexDirection: "row" }}>
                            <FiberManualRecordIcon fontSize='small' style={{ marginTop: "4px", marginRight: "4px" }} />
                            <p> Address - Nattu pilliyar koil st , sowcarpet , chennai</p>
                        </div>
                        <p><FiberManualRecordIcon fontSize='small' /> Postal code - 600001</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About