import { useEffect, useState } from 'react';
import { calculSize } from '../../utils';

import styles from '../../styles/home/filelist.module.scss';

export default function Filter({ globalSize, files, filesFilter, inputContent, setFilesFilter, setInputContent, loadItems }) {
    const [filteredSize, setFilteredSize] = useState(0);

    useEffect(() => {
        if (filesFilter.length < 1)
            return setFilteredSize(0);

        const size = filesFilter
            .map((file) => parseInt(file.fileBrutSize, 10))
            .reduce((prev, next) => prev + next);
            
        setFilteredSize(size);
        loadItems();
    }, [filesFilter, setFilesFilter]);

    return (
        <div className={styles['filter']}>
            <label htmlFor='input_search'>Rechercher • {calculSize(filteredSize)} — {globalSize && calculSize(globalSize)}</label>
            <input
                name='input_search'
                id='input_search'
                placeholder={`Rechercher parmis ${files?.length || 0} fichier${files?.length > 1 ? 's' : ''}`}
                onChange={({ target }) => {
                    setInputContent(target.value);
                    if (!files || files?.length < 1) return;

                    const filesFiltered = files.filter((file) => file.name.toLowerCase().includes(target.value.toLowerCase()) ? file : false);
                    setFilesFilter(filesFiltered);
                }}
                value={inputContent} />
        </div>
    );
}