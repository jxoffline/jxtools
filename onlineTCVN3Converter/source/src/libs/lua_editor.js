import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import "./lua_editor.scss";

const Editor = forwardRef(({ 
    text = '',
    onChange = () => {},
    className = '',
    style = {},
    encoding = 'utf8', // 'utf8' or 'tcvn3'
    onEncodedChange = () => {}, // callback for when the encoded text changes
    onScroll = () => {}, // callback for scroll sync
}, ref) => {
    const [displayText, setDisplayText] = useState(text);
    const textareaRef = useRef(null);
    const outputRef = useRef(null);
    const wrapperRef = useRef(null);

    // Expose refs to parent
    useImperativeHandle(ref, () => ({
        textareaRef,
        outputRef,
        wrapperRef
    }));

    // Initialize and update syntax highlighting
    const updateHighlighting = useCallback(() => {
        if (outputRef.current) {
            try {
                // Use direct highlight method for better control
                const result = hljs.highlight('lua', displayText);
                outputRef.current.innerHTML = result.value;
            } catch (e) {
                console.warn('Syntax highlighting failed:', e);
                // Fallback to plain text if highlighting fails
                outputRef.current.textContent = displayText;
            }
        }
    }, [displayText]);

    // Update display text when input text changes
    useEffect(() => {
        setDisplayText(text);
        // Use a small timeout to ensure the DOM is updated
        setTimeout(updateHighlighting, 0);
    }, [text, updateHighlighting]);

    const handleTextChange = useCallback(({ target }) => {
        const newText = target.value;
        setDisplayText(newText);
        onEncodedChange(newText);
    }, [onEncodedChange]);

    // Sync scroll between textarea and output, and notify parent
    const handleScroll = useCallback(() => {
        if (textareaRef.current && wrapperRef.current) {
            const { scrollTop, scrollLeft } = textareaRef.current;
            wrapperRef.current.style.transform = `translate(-${scrollLeft}px, -${scrollTop}px)`;
            onScroll(scrollTop, scrollLeft);
        }
    }, [onScroll]);

    return (
        <div className={`editor ${className}`} style={style}>
            <textarea
                ref={textareaRef}
                className="editor__input-area"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                value={displayText}
                onChange={handleTextChange}
                onScroll={handleScroll}
            />
            <div className="editor__output-area">
                <pre ref={wrapperRef} className="editor__output-area-wrapper">
                    <code
                        ref={outputRef}
                        className="editor__output-area-body lua"
                    >
                        {displayText}
                    </code>
                </pre>
            </div>
        </div>
    );
});

export default Editor; 