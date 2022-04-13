import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home() {

  const [salahTimings, setSalahTimings] = useState({
    fajr: '00:00',
    dhuhr: '00:00',
    asr: '00:00',
    maghrib: '00:00',
    isha: '00:00',
    sunrise: '00:00',
    sunset: '00:00'
  });

  const [salah, setSalah] = useState(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Sunrise', 'Sunset']);

  useEffect(() => {

    if (localStorage.getItem('timings') == null || localStorage.getItem('last-fetch-date-for-prayerTimings') == null) {

      fetchTimings();

    } else {

      let now = new Date().getDate();

      if (now == Number(localStorage.getItem('last-fetch-date-for-prayerTimings'))) {

        let timings = JSON.parse(localStorage.getItem('timings'));

        setSalahTimings((prev) => {
          return {
            ...prev,
            fajr: `${formatTime(timings.Fajr)}`,
            dhuhr: `${formatTime(timings.Dhuhr)}`,
            asr: `${formatTime(timings.Asr)}`,
            maghrib: `${formatTime(timings.Maghrib)}`,
            isha: `${formatTime(timings.Isha)}`,
            sunrise: `${formatTime(timings.Sunrise)}`,
            sunset: `${formatTime(timings.Sunset)}`
          }
        })

      } else {
        fetchTimings();
      }
    }


  }, [])

  function fetchTimings() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {

        localStorage.setItem('last-fetch-date-for-prayerTimings', new Date().getDate());
        console.log(new Date().getDate())
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

          localStorage.setItem('timings', JSON.stringify(data.timings));

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
  }

  function formatTime(time) {
    return time.split(" ")[0]
  }

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
