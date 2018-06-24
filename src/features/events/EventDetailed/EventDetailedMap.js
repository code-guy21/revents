import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import GoogleMapReact from 'google-map-react';

const Marker = () => <Icon name="marker" size="big" color="red" />;

const EventDetailedMap = ({ lat, lng }) => {
	const center = [lat, lng];
	const zoom = 14;
	return (
		<Segment attached="bottom" style={{ padding: 0 }}>
			<div style={{ height: '300px', width: '100%' }}>
				<GoogleMapReact
					bootstrapURLKeys={{ key: 'AIzaSyCj_7R15jhHbfIiFuiFYKh3HAY_CKAHu8g' }}
					defaultCenter={center}
					defaultZoom={zoom}
				/>
				<Marker lat={lat} lng={lng} />
			</div>
		</Segment>
	);
};

export default EventDetailedMap;
