import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    kakao: any;
  }
}

interface SearchResultType {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface PlaceType {
  lat: number;
  lng: number;
}

function App() {
  const [inputVal, setInputVal] = useState<string>('');
  const [placeInfo, setPlaceInfo] = useState<PlaceType>({
    lat: Math.random() * (37.6 - 37.4) + 37.4,
    lng: Math.random() * (126.93 - 126.9) + 126.9,
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputVal(value);
  };

  const handleSearch = () => {
    let places = new window.kakao.maps.services.Places();
    const searchFunc = (result: SearchResultType[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        console.log(result);
        setPlaceInfo({ lat: +result[0].y, lng: +result[0].x });
      }
    };
    places.keywordSearch(inputVal, searchFunc);
    setInputVal('');
  };

  useEffect(() => {
    let container = document.getElementById('map');
    let options = {
      center: new window.kakao.maps.LatLng(placeInfo.lat, placeInfo.lng),
      level: 3,
    };
    let markerPosition = new window.kakao.maps.LatLng(
      placeInfo.lat,
      placeInfo.lng,
    );

    let map = new window.kakao.maps.Map(container, options);
    let marker = new window.kakao.maps.Marker({
      map,
      position: markerPosition,
    });
  }, [placeInfo]);

  return (
    <Container>
      <MapContainer />
      <InputBox>
        <input
          value={inputVal}
          placeholder="입력 후 버튼클릭"
          onChange={(e) => handleInput(e)}
        />
        <button onClick={() => handleSearch()}>검색</button>
      </InputBox>
    </Container>
  );
}

export default App;

const Container = styled.div`
  width: ${window.innerWidth * 0.2777777777777778};
`;

const MapContainer = styled.div.attrs(() => ({
  id: 'map',
}))`
  width: 100%;
  height: 400px;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 200px;
  margin-top: 30px;

  button {
    margin-top: 10px;
    width: 50px;
    height: 20px;
  }
`;
