import React from 'react';
import { GameHowToPlayModal } from 'shared/ui/GameHowToPlayModal';

interface SpyHowToPlayProps {
  open: boolean;
  onClose: () => void;
}

export const SpyHowToPlay: React.FC<SpyHowToPlayProps> = ({ open, onClose }) => {
  const rules = [
    {
      title: 'Цель игры',
      content: 'Горожане должны найти шпионов среди игроков. Шпионы должны остаться незамеченными или угадать локацию.'
    },
    {
      title: 'Подготовка',
      content: 'Каждый игрок получает карточку с ролью. Горожане знают локацию, шпионы — нет.'
    },
    {
      title: 'Игровой процесс',
      content: 'Игроки по очереди задают друг другу вопросы о локации. Шпионы пытаются понять, где они находятся, не выдавая себя.'
    },
    {
      title: 'Обвинение',
      content: 'В любой момент игрок может обвинить другого в том, что он шпион. Начинается голосование.'
    },
    {
      title: 'Голосование',
      content: 'Все игроки (кроме обвиняемого) голосуют "за" или "против" исключения. Нужно простое большинство.'
    },
    {
      title: 'Победа горожан',
      content: 'Горожане побеждают, если исключат всех шпионов или если время истечет.'
    },
    {
      title: 'Победа шпионов',
      content: 'Шпионы побеждают, если их не найдут, если исключат горожанина, или если угадают локацию.'
    },
    {
      title: 'Угадывание локации',
      content: 'Шпион может попытаться угадать локацию для мгновенной победы (если включено в настройках).'
    }
  ];

  const hotkeys = [
    { key: 'Space', description: 'Начать/остановить раунд' },
    { key: 'R', description: 'Сбросить игру' },
    { key: 'H', description: 'Показать правила' },
    { key: 'S', description: 'Открыть настройки' },
    { key: 'L', description: 'Показать лог раунда' },
  ];

  return (
    <GameHowToPlayModal
      open={open}
      onClose={onClose}
      title="Как играть в Spy"
      rules={rules}
      hotkeys={hotkeys}
    />
  );
};
