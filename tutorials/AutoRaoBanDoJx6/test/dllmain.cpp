// dllmain.cpp : Defines the entry point for the DLL application.
#include "pch.h"
#include <string>
using namespace std;
DWORD WINAPI TestThread(LPVOID);
BOOL APIENTRY DllMain( HMODULE hModule,
                       DWORD  ul_reason_for_call,
                       LPVOID lpReserved
                     )
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
        CreateThread(NULL, NULL, &TestThread, NULL, NULL, NULL);
        break;
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}

DWORD WINAPI TestThread(LPVOID) {
    DWORD dwGBaseAddr = reinterpret_cast<DWORD>(GetModuleHandleA("game.exe"));
    typedef void(__cdecl* _exeChatScript)(const char* szScript);
    _exeChatScript exeChatScript = (_exeChatScript)(dwGBaseAddr + 0x140c0);
    while (true) {
        string szScript1 = "Chat('CH_NEARBY','MuaÙB¸nÙ§åÙ§¬nÙGi¶n')";
        exeChatScript(szScript1.c_str());
        Sleep(100);
        string szScript2 = "Chat('CH_CITY','MuaÙB¸nÙ§åÙ§¬nÙGi¶n')";
        exeChatScript(szScript2.c_str());
        Sleep(100);
        string szScript3 = "Chat('CH_WORLD','MuaÙB¸nÙ§åÙ§¬nÙGi¶n')";
        exeChatScript(szScript3.c_str());
        Sleep(10000);
    }
}
