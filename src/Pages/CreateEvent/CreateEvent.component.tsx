import { lazy, Suspense } from 'react';


const CreateEvent = () => {
    const CreateEventComponent = lazy(() => import('../../Components/CreateEvent/CreateEvent.component'));

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateEventComponent />
        </Suspense>
    )
}

export default CreateEvent;