import { ReactElement, useState } from "react";

interface InputProps {
    name: string;
    label?: string;
    labelComponent?: any;
    placeholder?: string;
    fieldClass?: string;
    value: string;
    onChangeCallback: ({ target }, value) => void;
}

export default function Input({
    name,
    label,
    labelComponent,
    placeholder,
    fieldClass = '',
    value,
    onChangeCallback
}: InputProps) {
    const [inputValue, setInputValue] = useState<string>(value);

    function onChange({ target }) {
        setInputValue(target.value);
        onChangeCallback({ target }, target.value);
    }

    return (<div className={`input-field ${fieldClass}`}>
        {label && (
            <label htmlFor={name} title={`${name} field`}>
                {label}
            </label>
        )}
        {!!labelComponent && (
            <label htmlFor={name} title={`${name} field`}>
                {labelComponent}
            </label>
        )}
        <input
            id={name}
            name={name}
            onChange={onChange}
            value={inputValue}
            placeholder={placeholder || 'Type something...'}
        />
    </div>);
}