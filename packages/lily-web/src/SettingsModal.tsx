import { useState } from "react"
import "./modal.css"
const initModalCtx = {
    title: "Delete book?",
    body: "body",
    warningTitle: 'Pages you are about to delete',
    data: {
        method: 'delete', 
    },
    actions: {
        mainAction: () => {return null;},
        createHandle: () => {return null;}
    },
}
const initNodeData = {
    uniqueId: 1,
    title: "Lorem Ipsum",
    body: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.",
    identity: '101'
};

const ssectionNodes = [
    {title: 'title', body: 'body', identity: 106 }
]
const sectionNodes = [
    {title: 'title', body: 'body', identity: 105, child: [], uniqueId: 1 },
    {title: 'title', body: 'body', identity: 105, child: ssectionNodes, uniqueId: 2 },
]
const createData = (x: any) => {
    return {sm: x, lg: `${x.charAt(0).toUpperCase()}${x.slice(1)}`}
}

export const SettingsModal = () => {
    const [modalCtx] = useState<any>(initModalCtx);
    const [node] = useState(initNodeData);
    const [childNodes] = useState(sectionNodes);
    const [topNode] = useState(initNodeData);
    const [botNode] = useState(initNodeData);

    const contentStyles = 'warning';
    const ti = 'warning';
    const {sm, lg} = createData(modalCtx.data.method);
    return <div className="modal">
        <div className="modal-container">
            <div className="modal-body">
                <div className={`modal-title ${ti}`}>
                    <span>{modalCtx.title}</span>
                </div>
                <div className={`modal-content ${contentStyles}`}>
                    <div className="sm-txt"><span>{modalCtx.warningTitle}</span></div>
                    <div className="page-del-styles">
                        <span>{node.title}, {node.identity}</span>
                    </div>
                    {
                        childNodes.map((nnode: any) => {
                            return <div style={{ marginLeft: 5 }} key={nnode.uniqueId}>
                                <div className="section-del-styles">
                                    <span>{nnode.title}, {nnode.identity}</span>
                                </div>
                                <div style={{ marginLeft: 10}}>
                                    {
                                        nnode.child && nnode.child.map((nnnode: any) => {
                                            return <div className="ssection-del-styles" key={nnnode.uniqueId}>
                                                <span>{nnnode.title}, {nnnode.identity}</span>
                                            </div>  
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
                <div className="gap"/>
                <div className="modal-logs">
                    <div className="sm-txt">
                        <span>Logs</span>
                    </div>
                    {topNode && <>
                        <div className="top-node">
                            Top: <span>{topNode.title}, {topNode.identity}</span>
                        </div>
                    </>}
                    {botNode && <>
                        <div className="bot-node">
                            Bottom: <span>{botNode.title}, {botNode.identity}</span>
                        </div>
                    </>}
                </div>
                <div className="gap"/>
                <div className="modal-button-container">
                    <button onClick={() => {
                        modalCtx.actions.mainAction();
                    }} className={`button button-${sm} margin-right-10`}>
                        {lg}
                    </button>
                    <button className="button button-cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
}