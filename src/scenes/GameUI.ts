import Phaser from 'phaser'

import { sceneEvents } from '../events/EventsCenter'

export default class GameUI extends Phaser.Scene
{
	private hearts!: Phaser.GameObjects.Group

	constructor()
	{
		super({ key: 'game-ui' })
	}

	create()
	{
		this.add.image(6, 26, 'treasure', 'coin_anim_f0.png')
		const coinsLabel = this.add.text(12, 20, '0', {
			fontSize: '14'
		})

		sceneEvents.on('player-coins-changed', (coins: number) => {
			coinsLabel.text = coins.toLocaleString()
		})

		this.hearts = this.add.group({
			classType: Phaser.GameObjects.Image
		})

		this.hearts.createMultiple({
			key: 'ui-heart-full',
			setXY: {
				x: 10,
				y: 10,
				stepX: 16
			},
			quantity: 3
		})

		sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged, this)
			sceneEvents.off('player-coins-changed')
		})
	}

	private handlePlayerHealthChanged(health: number)
	{
		this.hearts.children.each((go, idx) => {
			const heart = go as Phaser.GameObjects.Image
			if (idx < health)
			{
				heart.setTexture('ui-heart-full')
			}
			else
			{
				heart.setTexture('ui-heart-empty')
			}
		})
	}
}
