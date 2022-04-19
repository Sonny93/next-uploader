import { LineProgressBar } from '@frogress/line';

interface ProgressBarProps {
    name: string;
    label?: string;
    fieldClass?: string;
    progress: number;
    children?: any;
}

export default function ProgressBar({ name, label, fieldClass = '', progress, children }: ProgressBarProps) {
    const inProgressColor = '#3f88c5';
    const finishColor = '#00bd00';

    return (<div className={`progress-field ${fieldClass}`}>
        {label && (
            <label htmlFor={name}>
                {label}
            </label>
        )}
        <div className="progress-wrapper">
            <LineProgressBar
                progressColor={progress < 100 ? inProgressColor : finishColor}
                percent={progress}
            />
            <div className="details">
                {children}
            </div>
        </div>
    </div>);
}