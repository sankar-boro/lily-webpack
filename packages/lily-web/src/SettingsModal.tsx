/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react"
import "./modal.css"

const longText = 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document';
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
    {title: longText, body: longText, identity: 106 }
]
const sectionNodes = [
    {title: longText, body: longText, identity: 105, child: [], uniqueId: 1 },
    {title: longText, body: longText, identity: 105, child: ssectionNodes, uniqueId: 2 },
]
const createData = (x: any) => {
    return {methodSm: x, methodLg: `${x.charAt(0).toUpperCase()}${x.slice(1)}`}
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

const LogsComponent = ({topNode, botNode}: any) => {
    return <div className="modal-logs">
        <div className="sm-txt">
            <span>Logs</span>
        </div>
        {topNode && <>
            <div className="top-node">
                <div>&#8593; {topNode.title} <span> {topNode.identity}</span></div>
            </div>
        </>}
        {botNode && <>
            <div className="bot-node">
                <div>&#8595; {botNode.title} <span>{botNode.identity}</span></div>
            </div>
        </>}
    </div>
}

const SectionNodesComponent = ({node}: any) => {
    return <div className="modal-sectionChildNodes-con">
        {
            node.child && node.child.map((nnnode: any) => {
                return <div className="modal-ssectionNode" key={nnnode.uniqueId}>
                    <div>{nnnode.title} <span> . {nnnode.identity}</span></div>
                </div>  
            })
        }
    </div>
}

const ChildNodesComponent = ({childNodes}: any) => {
    return <div className="modal-childNodes-con">
    {
        childNodes.map((nnode: any) => {
            return <div key={nnode.uniqueId}>
                <div className="modal-sectionNode">
                    <div>{nnode.title}<span> . {nnode.identity}</span></div>
                </div>
                <SectionNodesComponent node={nnode} />
            </div>
        })
    }
    </div>
}
export const SettingsModal = () => {
    const [modalCtx] = useState<any>(initModalCtx);
    const [node] = useState(initNodeData);
    const [childNodes] = useState(sectionNodes);
    const [topNode] = useState(initNodeData);
    const [botNode] = useState(initNodeData);

    const contentStyles = 'warning';
    const ti = 'warning';
    const {methodSm, methodLg} = createData(modalCtx.data.method);
    return <div className="modal">
        <div className="modal-container">
            <div className="modal-body">
                
                <div className={`modal-title ${ti}`}>
                    <span>{modalCtx.title}</span>
                </div>
                
                <div className={`modal-content ${contentStyles}`}>
                    <div className="modal-warning-txt">
                        <span>{modalCtx.warningTitle}</span>
                    </div>
                    <div className="modal-mainNode">
                        <div className="title">{node.title}<span> . {node.identity}</span></div>
                    </div>
                    <ChildNodesComponent childNodes={childNodes} />
                </div>

                <LogsComponent topNode={topNode} botNode={botNode} />
                <ButtonComponents 
                    actions={modalCtx.actions}
                    cName={methodSm}
                    bName={methodLg}
                />
            </div>
        </div>
    </div>
}