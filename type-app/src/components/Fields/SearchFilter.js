import React from 'react';

const SearchFilter = (props) => {
    const {setSorted, page, setMessage, handleChange, term, reset} = props;
    const menuItems = () => {
        switch (page) {
            case "fridge":
                return (

                    <div className={"menu"}>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['name', 'desc']})
                        }}>
                            <i className={"sort alphabet down icon"}/>
                            <label>Name</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['name', 'asc']})
                        }}>
                            <i className={"sort alphabet up icon"}/>
                            <label>Name</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['style', 'desc']})
                        }}>
                            <i className={"sort alphabet down icon"}/>
                            <label>Style</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['style', 'asc']})
                        }}>
                            <i className={"sort alphabet up icon"}/>
                            <label>Style</label>
                        </div>
                    </div>
                )
            case "processes":
                return (
                    <div className={"menu"}>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['name', 'desc']})
                        }}>
                            <i className={"sort alphabet down icon"}/>
                            <label>Name</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['name', 'asc']})
                        }}>
                            <i className={"sort alphabet up icon"}/>
                            <label>Name</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['startDate', 'desc']})
                        }}>
                            <i className={"sort down icon"}/>
                            <label>Start Date</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['startDate', 'asc']})
                        }}>
                            <i className={"sort  up icon"}/>
                            <label>Start Date</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['endDate', 'desc']})
                        }}>
                            <i className={"sort down icon"}/>
                            <label>End Date</label>
                        </div>
                        <div className={"item"} onClick={() => {
                            setSorted({sorted: ['endDate', 'asc']})
                        }}>
                            <i className={"sort  up icon"}/>
                            <label>End Date</label>
                        </div>
                    </div>
                )
        }

    }

    return (
        <div>
            <div className={"ui centered grid"}
                 style={{paddingTop: "1%", paddingBottom: "2%"}}>
                <div className={"row"}>
                    <div style={{textAlign: "center"}} className={"ui icon input"} onClick={() => {
                        page === "processes" ? setMessage({infoMessage: "Use ':<type> <value>' to search based on filter type. Example: \":name process\" or \":endDate YYYY-MM-DD\""}) : setMessage({infoMessage: "Use ':<type> <value>' to search based on filter type. Example: \":name saftig\" or \":style ipa\" or \":desc tons of fruit\""});
                    }}>
                        <input value={term} onChange={handleChange}
                               className="input"/>
                        <i className={"search icon"} style={{marginRight: "5%"}}/>
                    </div>
                    <div style={{textAlign: "center"}} className={"ui simple icon dropdown button"}>
                        <i className={"filter icon"}/>
                        <i className="dropdown icon"/>
                        {menuItems()}
                    </div>
                    <div className={"ui button"} onClick={reset}>Reset</div>
                </div>
            </div>

        </div>);
}
export default SearchFilter;
