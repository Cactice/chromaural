# Chromaural

## Architecture
1st layer: Entities
2nd layer: Application
3rd layer: Interface
4th layer: Infra

- Notes
  - Input
    - Midi
    - Audio(from video element)
    - Keydown
    - MultiKeyboard Keydown
  - Output
    - Midi
    - Audio
    - Canvas
      - WebGL
      - Shader Algorithm


### Features
- MidiPlayer
  - Notes -> Audio
- MidiInterface
  - Key -> Notes
  - Midi -> Notes
- AudioVisualizer
  - Audio -> Notes
  - Notes -> Canvas
