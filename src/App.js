import React, { useState } from 'react';

const WeekendDestinationApp = () => {
  // 東京の主要駅リスト
  const stations = [
    "渋谷", "新宿", "池袋", "東京", "品川", "上野", "秋葉原", "銀座", "六本木",
    "原宿", "恵比寿", "代々木", "中野", "高田馬場", "御茶ノ水", "神田", "四ツ谷",
    "赤坂", "浜松町", "日本橋", "有楽町", "目黒", "自由が丘", "押上", "両国",
    "錦糸町", "葛西", "北千住", "大塚", "巣鴨", "駒込", "田端", "西日暮里",
    "日暮里", "三軒茶屋", "中目黒", "代官山", "表参道", "明治神宮前", "大崎",
    "五反田", "大井町", "蒲田", "羽田空港", "東陽町", "門前仲町", "月島", "豊洲"
  ];

  // テーマモードの形容詞と名詞
  const adjectives = [
    "近所の", "有名な", "静かな", "賑やかな", "歴史ある", "新しい", "おしゃれな",
    "隠れた", "穴場の", "人気の", "小さな", "大きな", "素敵な", "美味しい",
    "不思議な", "癒される", "懐かしい", "話題の", "季節の", "レトロな"
  ];

  const nouns = [
    "公園", "カフェ", "レストラン", "美術館", "博物館", "神社", "寺院", "図書館",
    "ショッピングモール", "市場", "商店街", "水族館", "動物園", "植物園", "展望台",
    "映画館", "劇場", "古着屋", "雑貨屋", "本屋", "ケーキ屋", "居酒屋", "ラーメン屋",
    "古民家", "庭園", "遊園地", "温泉", "銭湯", "ビーチ", "河川敷"
  ];

  // ステート管理
  const [mode, setMode] = useState('station');
  const [result, setResult] = useState('');
  const [customPlaces, setCustomPlaces] = useState('');
  const [placesArray, setPlacesArray] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [customInputError, setCustomInputError] = useState('');

  // ランダム選択の実装
  const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // アニメーション付きのランダム選択
  const animateRandomSelection = (items, finalResult) => {
    setIsAnimating(true);
    let counter = 0;
    const totalIterations = 20;
    const interval = setInterval(() => {
      counter++;
      if (counter <= totalIterations) {
        setResult(getRandomItem(items));
      } else {
        setResult(finalResult);
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 100);
  };

  // モード別の選択処理
  const selectDestination = () => {
    let selectedItem = '';
    
    if (mode === 'station') {
      selectedItem = getRandomItem(stations);
      animateRandomSelection(stations, selectedItem);
    } 
    else if (mode === 'theme') {
      const adj = getRandomItem(adjectives);
      const noun = getRandomItem(nouns);
      selectedItem = `${adj}${noun}`;
      
      // 形容詞と名詞の組み合わせでアニメーション
      const options = adjectives.flatMap(a => nouns.map(n => `${a}${n}`));
      animateRandomSelection(options, selectedItem);
    }
    else if (mode === 'custom') {
      if (placesArray.length === 0) {
        setCustomInputError('場所を入力してください');
        return;
      }
      selectedItem = getRandomItem(placesArray);
      animateRandomSelection(placesArray, selectedItem);
      setCustomInputError('');
    }
  };

  // カスタムリストの更新
  const updateCustomPlaces = (text) => {
    setCustomPlaces(text);
    if (text.trim() === '') {
      setPlacesArray([]);
      return;
    }
    
    const places = text.split(',')
      .map(place => place.trim())
      .filter(place => place !== '');
      
    setPlacesArray(places);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">週末どこ行く？</h1>
        
        {/* モード選択タブ */}
        <div className="flex mb-6">
          <button 
            className={`flex-1 py-2 px-4 ${mode === 'station' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-l-lg`}
            onClick={() => setMode('station')}
          >
            駅名モード
          </button>
          <button 
            className={`flex-1 py-2 px-4 ${mode === 'theme' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setMode('theme')}
          >
            テーマモード
          </button>
          <button 
            className={`flex-1 py-2 px-4 ${mode === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-r-lg`}
            onClick={() => setMode('custom')}
          >
            カスタム
          </button>
        </div>
        
        {/* カスタムモード入力欄 */}
        {mode === 'custom' && (
          <div className="mb-4">
            <textarea
              className="w-full p-2 border rounded-lg mb-2"
              rows="4"
              placeholder="行きたい場所をカンマ(,)区切りで入力"
              value={customPlaces}
              onChange={(e) => updateCustomPlaces(e.target.value)}
            />
            {customInputError && <p className="text-red-500 text-sm">{customInputError}</p>}
            {placesArray.length > 0 && (
              <p className="text-sm text-gray-600">{placesArray.length}箇所登録済み</p>
            )}
          </div>
        )}
        
        {/* モード説明 */}
        <div className="mb-6 bg-gray-100 p-3 rounded-lg text-sm">
          {mode === 'station' && <p>東京の駅からランダムに選びます</p>}
          {mode === 'theme' && <p>形容詞と名詞を組み合わせたテーマを提案します</p>}
          {mode === 'custom' && <p>自分で入力した場所からランダムに選びます</p>}
        </div>
        
        {/* 決定ボタン */}
        <button
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg mb-6 transition-colors"
          onClick={selectDestination}
          disabled={isAnimating}
        >
          {isAnimating ? 'ランダム中...' : '週末の行き先を決める！'}
        </button>
        
        {/* 結果表示 */}
        {result && (
          <div className={`p-4 bg-yellow-100 rounded-lg text-center ${isAnimating ? 'animate-pulse' : ''}`}>
            <p className="text-sm text-gray-600">あなたの週末の行き先は...</p>
            <h2 className="text-2xl font-bold text-blue-800">{result}</h2>
            <p className="mt-2 text-sm text-gray-600">楽しい週末をお過ごしください！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeekendDestinationApp;