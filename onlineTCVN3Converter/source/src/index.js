import React, { useState, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss'; 
import Editor from './libs/lua_editor';
import { tcvn3_to_utf8, utf8_to_tcvn3 } from './libs/helpers';
console.log('Tool'); 


const Tool = () => {
    const [utf8Text, setUtf8Text] = useState('');
    const [tcvn3Text, setTcvn3Text] = useState('');
    const utf8EditorRef = useRef(null);
    const tcvn3EditorRef = useRef(null);
    const isScrollingSynced = useRef(false);

    const [editorMode, setEditorMode] = useState('tcvn3');

    const handleUtf8Change = useCallback((newText) => {
        setUtf8Text(newText);
        setTcvn3Text(utf8_to_tcvn3(newText));
        // Ensure syntax highlighting updates
        if (tcvn3EditorRef.current?.outputRef.current) {
            hljs.highlightBlock(tcvn3EditorRef.current.outputRef.current);
        }
    }, []);

    const handleTcvn3Change = useCallback((newText) => {
        setTcvn3Text(newText);
        setUtf8Text(tcvn3_to_utf8(newText));
        // Ensure syntax highlighting updates
        if (utf8EditorRef.current?.outputRef.current) {
            hljs.highlightBlock(utf8EditorRef.current.outputRef.current);
        }
    }, []);

    const handleScroll = useCallback((source, scrollTop, scrollLeft) => {
        if (isScrollingSynced.current) return;
        isScrollingSynced.current = true;

        // Sync scroll position to both editors
        const syncScroll = (editorRef, scrollTop, scrollLeft) => {
            if (editorRef.current?.textareaRef.current) {
                editorRef.current.textareaRef.current.scrollTop = scrollTop;
                editorRef.current.textareaRef.current.scrollLeft = scrollLeft;
            }
            if (editorRef.current?.outputRef.current?.parentElement) {
                editorRef.current.outputRef.current.parentElement.scrollTop = scrollTop;
                editorRef.current.outputRef.current.parentElement.scrollLeft = scrollLeft;
            }
        };

        if (source === 'utf8') {
            syncScroll(tcvn3EditorRef, scrollTop, scrollLeft);
        } else {
            syncScroll(utf8EditorRef, scrollTop, scrollLeft);
        }

        isScrollingSynced.current = false;
    }, []);

    return (
        <>
            <div className="tabButtonsContainer">
                <button 
                    className={editorMode === 'tcvn3' ? 'active' : ''} 
                    onClick={() => setEditorMode('tcvn3')}
                >
                    TCVN3
                </button>
                <button 
                    className={editorMode === 'utf8' ? 'active' : ''} 
                    onClick={() => setEditorMode('utf8')}
                >
                    UTF-8
                </button>

                <div className="footer">
                    Author: <a
                            href="https://www.facebook.com/nghiemtucdeptrai"
                            target="_blank"
                            >vinh-ttn</a
                        >{" "}
                         (<a
                            href="https://github.com/jxoffline/jxtools/tree/main/onlineTCVN3Converter/source"
                            target="_blank"
                            >source code</a
                    >)
                </div>
            </div>
            <div id="editorWrapperContainer">
                <div className={["controllerContainer", editorMode === 'utf8' ? 'utf8' : 'tcvn3'].join(' ')}>
                    <div className="editorContainer forUtf8">
                        <Editor
                            ref={utf8EditorRef}
                            text={utf8Text}
                            onEncodedChange={handleUtf8Change}
                            onScroll={(top, left) => handleScroll('utf8', top, left)}
                            encoding="utf8"
                        />
                    </div> 
                    <div className="editorContainer forTcvn3">
                        <Editor
                            ref={tcvn3EditorRef}
                            text={tcvn3Text}
                            onEncodedChange={handleTcvn3Change}
                            onScroll={(top, left) => handleScroll('tcvn3', top, left)}
                            encoding="tcvn3"
                        />
                    </div> 
                </div>

                
            </div>
          
        </>
    );
};

const container = document.getElementById('container');
const root = createRoot(container);
root.render(<Tool />);