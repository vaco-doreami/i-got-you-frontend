# 🌄 **Features**
|||
|:---:|:---:|
|![feature1](/README.assets/main.gif) 플레이어 생성하기를 통해<br>플레이어를 생성할 수 있다.|![feature1](/README.assets/character_choice.gif) 캐릭터를 생성할 수 있다.<br>                         |
|![feature1](/README.assets/standby.gif) 대기화면에서는 실시간으로 플레이어의 수가 변경된다.|![feature1](/README.assets/room_list.gif) 방리스트에서는 방과 해당 방의 인원을<br>실시간으로 확인 할 수 있다.<br>|
|![feature1](/README.assets/police_meet.gif)경찰과 경찰이 만났을 때 작전회의 기능.|![feature1](/README.assets/police_robber_meet.gif)경찰과 도둑이 만났을 때 도둑이 깜빡거리다 사라짐.|
|![feature1](/README.assets/police_car_meet.gif)경찰이 차에 치였을때 3초간 조작금지.|

<br />
<br />

# 🖌 **Deploy**

- **Frontend**
  - Netlify : 애플리케이션 배포

<br />

- **Backend**
  - AWS Elastic Beanstalk : 애플리케이션 배포
  - Amazon ACM (AWS Certificate Manager) : SSL 발급 및 관리
  - Elastic Load Balancing : HTTPS 리스너 생성

<br />
<br />

# 🛠 **Tech stack**

- **Frontend**
  - React
  - react-router-dom
  - recoil
  - Phaser
  - Socket.io Client
  - simple-peer
  - Styled-components

<br />

- **Backend**
  - Node.js
  - Express
  - Socket.io

<br />
<br />

# 📉 **Difficulties**

- 간단하게 한 판 할 수 있는 단편성 게임이다 보니까 로그인해서 게임을 진행할 수 있게끔 하기보다는 게스트로 누구나 접속하여 간편하게 게임을 즐길 수 있게끔 구현하기로 하였습니다.
그래서 플레이어의 데이터를 DB에 저장하지 않고 일시적으로 필요한 데이터를 저장한 후에 게임이 종료된 후에 지워주는 방식으로 진행하게 되었고, 플레이어의 socket 아이디를 식별할 수 있는 키값으로 설정하였습니다. 그러다 보니까 게임에 참가하여 게임이 종료되기 전까지 해당 플레이어의 socket의 아이디가 유지되어야 했지만, 새로고침을 할 경우 socket이 다시 연결되어서 socket 아이디가 변경된다는 문제가 있었습니다.

- Phaser의 특성상 1초마다 60회의 렌더링이 일어나기 때문에 특정 시점에 단 한 번의 socket 이벤트 통신을 의도했지만, 순간적으로 여러 번의 socket 이벤트가 실행되어서 코드의 흐름을 예측하기 어려웠고
그로 인해서 예상하지 못한 에러가 빈번하게 발생하였습니다.

<br />
<br />

# 🔎 **Why ?**

- **Phaser**

  웹게임을 개발하기 위한 게임 엔진에 뭐가 있을까 찾아보니까 Pixi와 Phaser가 가장 대표적인 게임 엔진이라는 것을 알게 되었고 두 라이브러리 모두 많은 리소스와 예제 코드를 확인할 수 있었습니다.
  두 개중에 고민하다가 프로젝트의 테마가 게임이기 때문에 보편적인 게임 개발에 필요한 요소들을 프로젝트에 적용할 수 있겠다고 생각하게 되었고 Pixi는 게임 이외에 웹에 필요한 다른 기능들을 구현할 경우에도 범용적으로 사용되는 반면에 Phaser는 게임 프레임워크로 게임 개발에 특화되어있어서 게임 개발에 필요한 요소들을 구현하기 편리한 기능이 Pixi보다 더 많이 있을 것 같다고 생각되어서 Phaser로 선택하게 되었습니다.

- **simple-peer**

  경찰이 도둑을 잡기만 하면 뭔가 심심할 것 같아서 어떤 기능을 게임에 적용하면 좋을지 고민하다가 경찰끼리 만났을 때, 무전을 하는 것 처럼 화상회의를 통해 도둑을 어떻게 잡을지 논의할 수 있는 기능을
  게임에 추가하면 좋을 것 같다고 생각하게 되어서 webRTC에 대해 찾아보게 되었고 대부분의 webRTC 관련 글에서 simple-peer 라이브러리를 사용하여 webRTC를 구현하여서 simple-peer 라이브러리를 사용하기로 하였습니다.

- **recoil**

  상태관리 라이브러리를 알아보던 중에 recoil이 react 전용 라이브러리로 학습해야 할 양도 적고 작성해야 할 코드양도 redux보다 훨씬 적다는 것을 알게 되었습니다. 다만, recoil이
  전역에서 많은 데이터를 처리하면 나중에 성능상 이슈가 생길 수도 있다는 점이 걸렸습니다. 상태로 관리해야 할 값들이 뭐가 있을지를 생각해보니까 캐릭터의 위치값이나
  방향에 대한 데이터의 경우 게임 진행하는 동안에만 사용되어 따로 상태로 관리할 필요 없이 socket을 통해 데이터를 받아 바로 Phaser의 캐릭터에 적용하면 될 것 같다고 생각하게 되었고, 그러다 보니까 상태로 관리할 값이 플레이어의 정보, 모달 정도라고 생각되어서 recoil을 사용하여도 문제가 없을 것 같다고 생각되어서 recoil을 선택하게 되었습니다.
