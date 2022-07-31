import { ProgressUpload } from '../../front';

interface ProgressBarProps {
    name: string;
    label?: string;
    fieldClass?: string;
    progress: ProgressUpload;
    children?: any;
}

export default function ProgressBar({ name, label, fieldClass = '', progress, children }: ProgressBarProps) {
    return (<>
        <div className={`progress-field ${fieldClass}`}>
            {label && (
                <label htmlFor={name}>
                    {label}
                </label>
            )}
            <div className='progress-container'>
                <div className='progress-bar' style={{ width: progress.percent + '%' }} />
                <div className='details'>
                    {progress.percent} %
                </div>
            </div>
        </div>
    </>);
}