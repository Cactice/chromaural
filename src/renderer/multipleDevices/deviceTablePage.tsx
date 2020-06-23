
import React, {Suspense, lazy} from 'react'
import {Navbar} from './components/navbar'

const LazyTable = lazy(() => import ('./components/deviceTable'))

export const MultipleDevices = () => {
  return (
    <div className="app">
      <Navbar />
      <section className="hero is-light">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Devices List
            </h1>
            <h2 className="subtitle">
              Select your device here
            </h2>
          </div>
        </div>
      </section>
      <section className="device-section">
        <div className="columns is-centered">
          <div className="column is-half">
            <Suspense fallback={<div>Loading</div>}>
              <LazyTable />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
};