/* eslint-disable spaced-comment */
import { ScrollablePane, Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { IDataverseService } from '../services/DataverseService';
import { Store } from '../utils/types';
import { EditableGrid } from './EditableGrid/EditableGrid';
import { Loading } from './Loading';
import { getContainerHeight } from '../utils/commonUtils';
import { useAppDispatch } from '../store/hooks';
import { setLoading } from '../store/features/LoadingSlice';
import { saveRecords } from '../store/features/RecordSlice';
import { removeNewRows } from '../store/features/DatasetSlice';

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

  const dispatch = useAppDispatch();

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
          saveButtonHandler(e)
        }
      };

      // Attach listener
      updateButton.addEventListener('click', handleUpdateClick, true);

      // Cleanup on unmount
      return () => {
        updateButton.removeEventListener('click', handleUpdateClick, true);
      };
    }, []);


  const saveButtonHandler = (e: MouseEvent) => {

    e.preventDefault();
    e.stopPropagation();

    dispatch(setLoading(true));
    dispatch(saveRecords(props._service))
      .unwrap()
      .then(() => {
        props.dataset.refresh();
        dispatch(removeNewRows());
        document.querySelector<HTMLButtonElement>('#NextButton').click();
      })
      .catch(error =>
        props._service.openErrorDialog(error).then(() => {
          dispatch(setLoading(false));
        })
      );
    };

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
