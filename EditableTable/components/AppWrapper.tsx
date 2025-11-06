/* eslint-disable spaced-comment */
import { ScrollablePane, Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { IDataverseService } from '../services/DataverseService';
import { Store } from '../utils/types';
import { EditableGrid } from './EditableGrid/EditableGrid';
import { Loading } from './Loading';
import { getContainerHeight } from '../utils/commonUtils';

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IDataSetProps {
  dataset: DataSet;
  isControlDisabled: boolean;
  width: number;
  _store: Store;
  _service: IDataverseService;
  _setContainerHeight: Function;
}

export const Wrapper = (props: IDataSetProps) => {
  const [containerHeight, setContainerHeight] =
    useState(getContainerHeight(props.dataset.sortedRecordIds.length));

  const _setContainerHeight = useCallback((height: number) => {
    setContainerHeight(height);
  }, []);

  const SubgridSaveGuard: React.FC = () => {
    useEffect(() => {
      const updateButton = document.querySelector<HTMLButtonElement>('#UpdateButton');
      const saveSubgrid = document.querySelector<HTMLButtonElement>('#saveSubgrid');

      if (!updateButton) {
        console.warn('⚠️ UpdateButton not found in DOM.');
        return;
      }

      const handleUpdateClick = (e: MouseEvent) => {
        const saveBtn = document.querySelector<HTMLButtonElement>('#saveSubgrid');

        if (saveBtn && !saveBtn.disabled) {
          e.preventDefault();
          e.stopPropagation();
          alert('Please save the Toms subgrid before updating.');
        }
      };

      // Attach listener
      updateButton.addEventListener('click', handleUpdateClick, true);

      // Cleanup on unmount
      return () => {
        updateButton.removeEventListener('click', handleUpdateClick, true);
      };
    }, []);

    return null; // This component doesn’t render anything
  };

  return <Provider store={props._store} >
    <div className='appWrapper' tabIndex={0}>
      <Loading />
      <SubgridSaveGuard />
      <Stack style={{ width: props.width /*height: containerHeight*/ }} >
        <ScrollablePane style={{ position: 'initial' }}>
          <EditableGrid {...{ ...props, _setContainerHeight }} />
        </ScrollablePane>
      </Stack>
    </div>
  </Provider>;
};
