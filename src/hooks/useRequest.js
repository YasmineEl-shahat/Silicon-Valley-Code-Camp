import React,{ useReducer, useEffect} from 'react';
import requestReducer , { REQUEST_STATUS } from '../reducers/request';

import axios from 'axios';

import {
    PUT_SUCCESS,
    PUT_FAILURE,
    GET_ALL_SUCCESS,
    GET_ALL_FAILURE,
    PUT,
} from '../actions/request';
import { store } from 'react-notifications-component';

const useRequest = (baseUrl, routeName) => {
    const [{ records, status, error }, dispatch] = useReducer(requestReducer, {
        records: [],
        status: REQUEST_STATUS.LOADING,
        error: null,
      });

      //handle REST call cancelling
      const signal = React.useRef(axios.CancelToken.source());

      useEffect(() =>{
        const fetchData = async () =>{
          try{
            const response = await axios.get(`${baseUrl}/${routeName}`, {
              cancelToken: signal.current.token,
            });
            dispatch({
              records: response.data,
              type: GET_ALL_SUCCESS,
            });
          }catch(e){
            console.log('loading data error', e);
            if (axios.isCancel(e)){
              console.log('Get request canceled');
            }else{
              dispatch({
                error: e,
                type: GET_ALL_FAILURE,  
              });
            }
          }
        };
        fetchData();
        return () =>{
          console.log('unmount and cancel running axios request');
          signal.current.cancel();
        }
      }, [baseUrl, routeName]);
    
    const propsLocal = {
        records,
        status,
        error,
        put: React.useCallback(async (record) =>{
            try{
                dispatch({
                  type: PUT,
                  record,
                });
                await axios.put(`${baseUrl}/${routeName}/${record.id}`, record);
                dispatch({
                  type: PUT_SUCCESS,
                  record: record,
                });
              } catch(e) {
                dispatch({
                  error: e,
                  type: PUT_FAILURE,
                })
                store.addNotification({
                  title: 'Favorite Status Update Failure.  Setting Back...',
                  message: `Speaker: ${record.firstName} ${record.lastName}`,
                  type: 'danger',
                  insert: 'top',
                  container: 'top-right',
                  animationIn: ['animated', 'fadeIn'],
                  animationOut: ['animated', 'fadeOut'],
                  dismiss: {
                    duration: 3000,
                    onScreen: true,
                  },
                });
              }

            
        },[]),
    };
    return propsLocal;
};

export default useRequest;