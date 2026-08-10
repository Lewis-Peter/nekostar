---
title: "用 M5Stack Cardputer 做一个口袋 ChatGPT 终端"
date: 2026-08-08
tags: ["esp32", "cardputer", "hardware", "chatgpt", "tutorial"]
summary: "给 M5Stack Cardputer 写了一个 ChatGPT 聊天客户端，接 OpenAI 兼容 API，国内可用。"
# 示例稿：正文里还有「这是一篇示例文章」和两节「占位：」，
# 代码是 api.example.com / YOUR_MODEL 的演示片段，不是实跑的。
# 等 drafts/ 里的真文章补齐实测数据后再换掉这篇。
draft: true
apiNote: true
---

## 成品展示

![Cardputer Chat 成品图片占位](/images/cardputer-placeholder.svg)

这是一篇示例文章，用来展示博客的排版、代码高亮和文章结构。后续请将占位内容替换为真实的开发记录和成品照片。

## 为什么做这个

Cardputer 有键盘、屏幕、Wi-Fi 和足够好玩的 ESP32-S3。把它做成一个随身 AI 终端，既能验证受限设备上的交互方式，也能测试流式 API 在嵌入式网络环境里的表现。

## 硬件准备

- M5Stack Cardputer 一台
- USB-C 数据线
- 可用的 2.4 GHz Wi-Fi
- PlatformIO 或 Arduino IDE

## 核心代码讲解

下面的代码演示如何组织一次最小请求。正式项目中还需要补充证书校验、超时、重试和流式解析。

```cpp
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

void sendMessage(const String& prompt) {
  WiFiClientSecure client;
  client.setInsecure(); // 示例代码；生产环境应配置 CA 证书

  HTTPClient http;
  http.begin(client, "https://api.example.com/v1/chat/completions");
  http.addHeader("Authorization", "Bearer " + apiKey);
  http.addHeader("Content-Type", "application/json");

  String body = "{\"model\":\"YOUR_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"";
  body += prompt;
  body += "\"}]}";
  int status = http.POST(body);
}
```

## API 接入说明

客户端使用 OpenAI 兼容接口，只需要配置 API Endpoint、Key 和模型名。务必把密钥保存在本地配置中，不要提交到公开仓库。

## 踩坑记录

占位：记录 TLS 内存占用、中文字体、键盘扫描、Wi-Fi 重连和 SSE 分段解析等问题。

## 效果演示

占位：补充 GIF、视频链接或真实设备上的响应时间数据。

## 下一步计划

- 支持流式输出与中途取消
- 增加历史会话的本地保存
- 优化中文输入和长文本滚动
- 整理代码并公开仓库
