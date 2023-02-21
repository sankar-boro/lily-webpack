/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import "./settingsModal.css"

const settingsStyle = {
    flex: {
        flex: 1
    },
    select: {
        padding: 5
    }
}

const bodyFontFamilies = [
    {fontFamily: "Source-Sans-Pro-Regular"},
    {fontFamily: "Arial"},
    {fontFamily: "Times New Roman"},
    {fontFamily: "Courier New"},
    {fontFamily: "monospace"},
];

const titleFontFamilies = [{
    fontFamily: "RobotoSlab-Bold" 
}];

const fontSizes = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 28, 32, 40, 46, 52, 64, 72, 80];

const Margin = () => {
    return <div style={{ borderTop: "1px solid #ccc", marginTop: 10, marginBottom: 10 }} />
}

const thisStyles = { 
    backgroundColor: "#ffffff", 
    headerColor: "white", 
    color: "black",
    subSection: "#424242",
    titleColor: "#2d2d2d",
    titleFontFamily: "RobotoSlab-Bold",
    descriptionColor: "black",
    descriptionFontFamily: "Source-Sans-Pro-Regular",
    descriptionFontSize: 16,
    backgroundImage: 'linear-gradient(to bottom right, #f3f3f3, #f3f3f3)'
}

const ButtonComponents = ({ cName, actions, bName }: any) => {
    return <div className="modal-button-container">
        <button onClick={() => {actions.mainAction()}} className={`button button-${cName} margin-right-10`}>
            {bName}
        </button>
        <button className="button button-cancel" onClick={() => {actions.cancelAction()}}>
            Cancel
        </button>
    </div>
}

export const StylesModal = () => {;
    
    const [styles] = useState(thisStyles);

    const onChangeFontSize = () => {
        // dispatch({keys: ['styles'], values: [{...styles, descriptionFontSize: parseInt(v.target.value) }]})
    }

    const onChangeFontFamily = () => {

        // dispatch({keys: ['styles'], values: [{...styles, descriptionFontFamily: v.target.value }]})
    }

    return  <div className="modal">
        <div className="modal-container">
            <div className="modal-title">
                Body styles
            </div>

            <div className="modal-body">
                <div className="style-item">
                    <span>Font Family</span>
                    <select name="fontFamily" value={styles.descriptionFontFamily} onChange={() => { onChangeFontFamily() }}>
                        {
                            bodyFontFamilies.map((c: any) => {
                                return <option value={c.fontFamily} key={c.fontFamily} style={{ fontFamily: c.fontFamily }}>{c.fontFamily}</option>
                            })
                        }
                    </select>
                </div>
                <div className="style-item">
                    <span>Font Size</span>
                    <select name="fontSize" value={styles.descriptionFontSize} onChange={() => { onChangeFontSize() }}>
                        {
                            fontSizes.map((c: any) => {
                                return <option value={c} key={c}>{c}</option>
                            })
                        }
                    </select>
                </div>
                <div className="style-item">
                    <span>Title Font Family</span>
                    <select name="fontFamily" value={styles.descriptionFontFamily} onChange={() => { onChangeFontFamily() }}>
                        {
                            titleFontFamilies.map((c: any) => {
                                return <option value={c.fontFamily} key={c.fontFamily} style={{ fontFamily: c.fontFamily }}>{c.fontFamily}</option>
                            })
                        }
                    </select>
                </div>
            </div>
            <ButtonComponents 
                actions={{}}
                cName="create"
                bName="Create"
            />

        </div>
    </div>
}

export default StylesModal;