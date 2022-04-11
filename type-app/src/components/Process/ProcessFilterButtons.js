import React, {useState} from 'react';

const ProcessFilterButtons = (props) => {

    const [active, setActive] = useState("active");

    return (
        <div className={"ui centered grid"} style={{}}>
            <div className="ui buttons">
                <button className={`ui basic ${active === 'active' ? 'yellow' : 'grey'} button`} onClick={(e) => {
                    setActive("active")
                    props.setView('active', '#fbbd08')
                }}>Active
                </button>
                <button className={`ui basic ${active === 'upcoming' ? 'green' : 'grey'} button`} onClick={(e) => {
                    setActive("upcoming")
                    props.setView('upcoming', '#21ba45')
                }}>Upcoming
                </button>
                <button className={`ui basic ${active === 'overdue' ? 'red' : 'grey'} button`} onClick={(e) => {
                    setActive("overdue")
                    props.setView('overdue', '#db2828')
                }}>Overdue
                </button>
                <button className={`ui basic ${active === 'all' ? 'black' : 'grey'} button`} onClick={(e) => {
                    setActive("all")
                    props.setView('all', '#767676')
                }}>All
                </button>
            </div>
        </div>);
}
export default ProcessFilterButtons;
