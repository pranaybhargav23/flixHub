import { StyleSheet, Text, View } from 'react-native'
import React,{useState, useEffect} from 'react'

const useFetch = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiKey = '18819a0f957bd623b89db02b786a8581';
        const apiUrl = 'https://api.themoviedb.org/3/discover/tv';

        const response = await fetch(`${apiUrl}?api_key=${apiKey}`);

  const json = await response.json();
  console.log(json, "Fetched JSON response");
  setData(json);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

   return {data,loading,error};
}

export default useFetch

const styles = StyleSheet.create({})