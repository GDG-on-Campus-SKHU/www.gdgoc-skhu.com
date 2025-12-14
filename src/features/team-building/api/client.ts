// 팀빌딩 영역에서도 전역 axios 인스턴스를 그대로 사용합니다.
// 공통 인터셉터(토큰 주입/재발급) 동작을 동일하게 유지하기 위해 래퍼만 제공합니다.
import { api } from '@/lib/api';

export const teamBuildingApi = api;
