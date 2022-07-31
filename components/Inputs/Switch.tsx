interface SwitchProps {
    checked: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
}

export default function Switch({ checked = false, onChange, disabled }: SwitchProps) {
    return (<>
        <label className='switch'>
            <input
                type='checkbox'
                onChange={({ target }) => onChange(target.checked)}
                checked={checked}
                disabled={disabled}
            />
            <span className='slider'></span>
        </label>
    </>);
}