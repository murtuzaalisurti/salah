import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
// import styles from '../styles/Home.module.css'

export default function Home() {

  const [salahTimings, setSalahTimings] = useState({
    fajr: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: '',
    sunrise: '',
    sunset: ''
  });

  const [salah, setSalah] = useState(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Sunrise', 'Sunset']);

  useEffect(() => {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {

        let date_obj = new Date();
        let month = date_obj.getMonth();
        let year = date_obj.getFullYear();
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        fetch(`api/timings`, {
          method: 'POST',
          ContentType: 'application/json',
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            month: month,
            year: year
          })
        }).then((res) => {
          return res.json();
        }).then((data) => {
          console.log(data.timings);

          function formatTime(time) {
            return time.split(" ")[0]
          }

          setSalahTimings((prev) => {
            return {
              ...prev,
              fajr: `${formatTime(data.timings.Fajr)}`,
              dhuhr: `${formatTime(data.timings.Dhuhr)}`,
              asr: `${formatTime(data.timings.Asr)}`,
              maghrib: `${formatTime(data.timings.Maghrib)}`,
              isha: `${formatTime(data.timings.Isha)}`,
              sunrise: `${formatTime(data.timings.Sunrise)}`,
              sunset: `${formatTime(data.timings.Sunset)}`
            }
          })
        }).catch((err) => {
          console.log(err);
        })

      }, (error) => console.log(error))
    } else {
      console.log('geolocation api not supported');
    }

  }, [])

  return (
    <div className='container'>
      <Head>
        <title>Salah</title>
        <meta name="description" content="Islamic Prayer Timings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className='main'>
        <div className="timings">
          {Object.keys(salahTimings).map((key, index) => {
            return (
              <div className='salah-time-individual-contain' key={index}>
                <div className="whichsalah">{`${salah[index]}`}</div>
                <div className="time">{`${salahTimings[key]}`}</div>
              </div>
            )
          })}
        </div>
      </main>

      <footer>
      </footer>
    </div>
  )
}
