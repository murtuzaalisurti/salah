import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import moment from 'moment';

export default function Home() {

  // states ------------------------------------------------------

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

  const [currentSalah, setCurrentSalah] = useState({
    salah: '',
    time: ''
  });

  const [nextSalah, setNextSalah] = useState({
    salah: '',
    time: ''
  });

  const [timeUntilNextSalah, setTimeUntilNextSalah] = useState({
    hours: '',
    minutes: ''
  });

  const [milliseconds, setMilliseconds] = useState('');

  const [currentDate, setCurrentDate] = useState({
    month: new Date().toLocaleString('default', {month: 'numeric'}),
    year: new Date().toLocaleString('default', {year: 'numeric'}),
    date: new Date().toLocaleString('default', {day: 'numeric'}),
    weekday: new Date().toLocaleString('default', {weekday: 'long'})
  })

  const [islamicCalendar, setIslamicCalendar] = useState({});

  // salah timings ----------------------------------------------

  // fetch prayer timings from API
  const fetchTimings = useCallback(() => {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition((position) => {

        document.querySelector('.alert').classList.add('none');
        localStorage.setItem('last-fetch-date-for-prayerTimings', new Date().getDate());
        
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        fetch(`api/timings`, {
          method: 'POST',
          ContentType: 'application/json',
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            month: currentDate.month,
            year: currentDate.year
          })
        }).then((res) => {
          return res.json();
        }).then((data) => {

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

      }, (error) => {
        if(error.PERMISSION_DENIED || error.POSITION_UNAVAILABLE || error.TIMEOUT) {
          document.querySelector('.alert').classList.remove('none');
        }
      })

    } else {
      console.log('geolocation api not supported');
    }
  }, [currentDate]);
  
  // retrieve prayer timings from localStorage or API
  useEffect(() => {

    if (localStorage.getItem('timings') == null || localStorage.getItem('last-fetch-date-for-prayerTimings') == null) {
      fetchTimings();
    } else {
      // fetchTimings();
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
  }, [fetchTimings])


  // doesn't support Safari | MacOS | iOS
  // so it's removed (not executed)
  function handlePermission() {
    navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      if (result.state == 'granted') {
        report(result.state);
        document.querySelector('.alert').classList.add('none');
        fetchTimings();
      } else if (result.state == 'prompt') {
        report(result.state);
        fetchTimings();

        result.onchange = () => {

          if (result.state == 'denied') {
            document.querySelector('.alert').classList.remove('none');
          }

        }
      } else if (result.state == 'denied') {
        report(result.state);
        document.querySelector('.alert').classList.remove('none');
      }
      result.addEventListener('change', function () {
        report(result.state);
      });
    });
  }

  // part of handlePermission()
  function report(state) {
    console.log('Permission ' + state);
  }

  // format time (split time from timezone)
  function formatTime(time) {
    return time.split(" ")[0]
  }

  useEffect(() => {
    setMilliseconds(moment().format('x'))
  }, [])

  // update milliseconds at a specific interval
  useEffect(() => {

    let refresh = setInterval(() => {
      setMilliseconds(moment().format('x'))
    }, 30000)

    return () => {
      clearInterval(refresh);
    }
  }, []);

  // pending and done salah timings display logic
  function setNextAndCurrentSalah(element, NextOrCurrent) {

    function timeAndSalah(ele, timeOrSalah) {
      if(NextOrCurrent == 'current') {
        setCurrentSalah((prev) => {
          return {
            ...prev,
            [timeOrSalah]: ele.innerText
          }
        })
      } else if(NextOrCurrent == 'next') {
        setNextSalah((prev) => {
          return {
            ...prev,
            [timeOrSalah]: ele.innerText
          }
        })
      }
    }

    element.childNodes.forEach((ele) => {
      if(ele.classList.contains('whichsalah')){
        timeAndSalah(ele, 'salah');
      } else if(ele.classList.contains('time')) {
        timeAndSalah(ele, 'time');
      }
    })
  }
  useEffect(() => {
    document.querySelector('.pending') == null ? document.querySelector('.timings > div').classList.add('reset') : document.querySelector('.timings > div').classList.remove('reset');
    document.querySelectorAll('.pending').forEach((element, index) => {
      index == 0 && element.classList.add('first')
    })
  })
  
  useEffect(() => {
    if(document.querySelector('.done') !== null) {
      document.querySelectorAll('.done').forEach((element, index) => {
        if(index == (document.querySelectorAll('.done').length - 1)) {
          setNextAndCurrentSalah(element, 'current');
        }
      })
    }
    
    if(document.querySelector('.pending') !== null) {
      document.querySelectorAll('.pending').forEach((element, index) => {
        if(index == 0) {
          setNextAndCurrentSalah(element, 'next');
        }
      })
    } else {
      document.querySelectorAll('.done').forEach((element, index) => {
        if(index == 0) {
          setNextAndCurrentSalah(element, 'next');
        }
      })
    }

  }, [milliseconds, salahTimings, islamicCalendar])
  
  useEffect(() => {

    // total minutes
    let nextsalahcalcMinutes = Number(nextSalah.time.split(":")[0])*60 + Number(nextSalah.time.split(":")[1])
    let currentTimeinMinutes = Number((moment().hours()*60)+(moment().minutes()))

    // minutes excluding hours

    let timeUntilNextSalahinMinutes, timeUntilNextSalahinHours;
    
    if(currentTimeinMinutes < nextsalahcalcMinutes) {

      timeUntilNextSalahinMinutes = Number(nextsalahcalcMinutes - currentTimeinMinutes)%60;
      timeUntilNextSalahinHours = Math.floor(Number(nextsalahcalcMinutes - currentTimeinMinutes)/60)

    } else if((currentTimeinMinutes > nextsalahcalcMinutes) && (currentTimeinMinutes > (Number(salahTimings.isha.split(":")[0])*60 + Number(salahTimings.isha.split(":")[1]))) && (currentTimeinMinutes <= 1440)) {

      timeUntilNextSalahinMinutes = (Number(-1))*((Number(currentTimeinMinutes - nextsalahcalcMinutes - 1320)%60));
      timeUntilNextSalahinHours = (Number(-1))*(Math.floor(Number(currentTimeinMinutes - nextsalahcalcMinutes - 1320)/60));

    }

    setTimeUntilNextSalah((prev) => {
      return {
        ...prev,
        hours: timeUntilNextSalahinHours,
        minutes: timeUntilNextSalahinMinutes
      }
    })

  }, [currentSalah, nextSalah, salahTimings])

  // calendar ----------------------------------------------------------

  // fetch islamic calendar from API
  const fetchCalendar = useCallback(() => {
    fetch(`https://api.aladhan.com/v1/gToHCalendar/${currentDate.month}/${currentDate.year}?adjustment=1`).then((res) => {
        return res.json();
      }).then((data) => {
        localStorage.setItem('lastUpdatedMonth', JSON.stringify(currentDate.month));
        localStorage.setItem('islamic-days', JSON.stringify(data.data));
        setIslamicCalendar((prev) => {
          return data.data;
        })
      }).catch((err) => {
        console.log(err)
      })
  }, [currentDate])

  // retrieve islamic calendar from local storage or from API
  useEffect(() => {

    if(localStorage.getItem('lastUpdatedMonth') == null || localStorage.getItem('islamic-days') == null) {
      fetchCalendar();
    } else {
      if(currentDate.month === JSON.parse(localStorage.getItem('lastUpdatedMonth'))){
        setIslamicCalendar((prev) => {
          return JSON.parse(localStorage.getItem('islamic-days'));
        })
      } else {
        fetchCalendar();
      }
    }
  }, [fetchCalendar, currentDate])

  return (
    <div className='container'>
      <Head>
        <title>Salah</title>
        <meta name="description" content="Islamic Prayer Timings" />
      </Head>

      <main className='main'>
        <div className="currentSalah">
          <div className="text">{`${salahTimings.fajr !== '00:00' ? currentSalah.salah : 'Salah'}`}</div>
          <div className={`timeUntilNextSalah${salahTimings.fajr == '00:00' ? ' diffLoading' : ''}`}>{`${salahTimings.fajr !== '00:00' ? `${timeUntilNextSalah.hours != 0 ? `${timeUntilNextSalah.hours == 1 ? `${timeUntilNextSalah.hours} hr` : `${timeUntilNextSalah.hours} hrs`}` : ''} ${timeUntilNextSalah.minutes != 0 ? `${timeUntilNextSalah.minutes} min` : ''}` : ''}`}</div>
          <div className={`untilSalah${salahTimings.fajr == '00:00' ? ' diffLoading nextsalah' : ''}`}>{`${salahTimings.fajr !== '00:00' ? `until ${nextSalah.salah}` : ''}`}</div>
        </div>
        <div className="fullDate">
          <div className="islamicDateDisplay">
            {
              islamicCalendar[currentDate.date - 1] !== undefined && (
                <>
                  <div className="islamDay">{islamicCalendar[currentDate.date - 1].hijri.day}</div>
                  <div className="islamMonth">{islamicCalendar[currentDate.date - 1].hijri.month.en},</div>
                  <div className="islamYear">{islamicCalendar[currentDate.date - 1].hijri.year}</div>
                </>
              )
            }
          </div>
          <div className="dayDisplay">{currentDate.weekday}</div>
        </div>
        <div className="alert none">Please enable location to get salah timings!</div>
        <div className="timings">
          {salahTimings.fajr !== '00:00' ? Object.keys(salahTimings).map((key, index) => {
            if (key !== 'sunrise' && key !== 'sunset') {
              return (
                <div className={`salah-time-individual-contain${moment({ hour: salahTimings[key].split(':')[0], minute: salahTimings[key].split(':')[1] }).format('x') > milliseconds ? ` pending` : ' done'}`} key={index}>
                  <div className='whichsalah'>{`${salah[index]}`}</div>
                  <div className="time">{`${salahTimings[key]}`}</div>
                </div>
              )
            }
          }) : Object.keys(salahTimings).map((key, index) => {
            if (key !== 'sunrise' && key !== 'sunset') {
              return (
                <div className={`salah-time-individual-contain${moment({ hour: salahTimings[key].split(':')[0], minute: salahTimings[key].split(':')[1] }).format('x') > milliseconds ? ` pending` : ' done'}`} key={index}>
                  <div className='whichsalah'>{`${salah[index]}`}</div>
                  <div className="time time-loading">
                    <div className="line" id="line1"></div>
                    <div className="line" id="line2"></div>
                  </div>
                </div>
              )
            }
          })}
        </div>
      </main>
    </div>
  )
}
